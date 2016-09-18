<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Book;

use App\Sale;

use App\SaleDetail;

use Log;

use DB;

use PDF;

use Carbon\Carbon;

use Illuminate\Support\Collection;



class CartController extends Controller
{

    protected $book;

    protected $sale;

    protected $saleDetail;

    protected $bookData = [];

    public function __construct(Book $book, Sale $sale, SaleDetail $saleDetail){
        $this->middleware('jwt.auth', []);
        $this->book = $book;
        $this->sale = $sale;
        $this->saleDetail = $saleDetail;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        try{
 
                $books = Book::with([
                                        'category' => function($q) use($request) { $q->where('name','like','%'.$request->input('search').'%'); },
                                        'supplier' => function($q) use($request) { $q->where('name','like','%'.$request->input('search').'%'); },
                                        'level' => function($q) use($request) { $q->where('name','like','%'.$request->input('search').'%'); }
                                    ])
                                    ->where('title','like', '%'.$request->input('search').'%' )
                                    ->orWhere('author','like', '%'.$request->input('search').'%' )
                                    ->where('quantity','>', 0 )
                                    ->get();

                return response()->json( compact('books'), 200 );
                        
        }catch(\Exception $e) {
            Log::error("Exception caught, filename: " . $e->getFile() . " on line: " . $e->getLine());
            Log::error($e->getMessage());
            return response()->json(["error" => "Something unusual happened"], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try{

            collect( collect( $request->all() )->get('items') )->filter(function($value, $key){
                 $data = collect( $value )->only(['id', 'cart_quantity','cart_total','sales_price','title']);
                 array_push($this->bookData, $data->all());
            });

            $cart = collect($this->bookData)->pluck('cart_quantity','id')->all();

            try{

                $this->book->whereIn('id', array_keys($cart) )->get()->filter(function ($book, $key) use($cart) {
                    if( $cart[$book->id] > $book->quantity )
                        throw new \Exception( "The quanity specified for the book ". strtoupper($book->title) ." is more than the items in stock[ {$book->quantity} ] for the product", 1);
                    return $book;
                });

            }catch(\Exception $e){
                Log::error("Exception caught, filename: " . $e->getFile() . " on line: " . $e->getLine());
                Log::error($e->getMessage());
                return response()->json(["error" => 'Error recording book sale...'], 422);
            }

            DB::beginTransaction();

            try{

                $sale = $this->sale->create( 
                                                [ 
                                                    'cash_received' => $request->input('cash_received'), 
                                                    'balance' =>  $request->input('balance') 
                                                ] 
                                            );
                $saleId = $sale->id;

                $this->book->whereIn('id', array_keys($cart) )->get()->each(function ($book, $key) use($saleId) {

                        collect($this->bookData)->each(function($data, $k) use($book,$saleId){

                            if($data['id'] == $book->id){
                                $this->saleDetail->create(
                                                            [
                                                                'sale_id' => $saleId,
                                                                'book_id' => $book->id, 
                                                                'quantity' => $data['cart_quantity'], 
                                                                'cost' => $data['cart_total']
                                                            ]
                                                        );
                                
                                $book->decrement('quantity', $data['cart_quantity']);
                                $book->save();//Update product quantity
                            }

                        });

                });

                if(! file_exists(public_path().'/receipts') ) mkdir( public_path()."/receipts" );
                if(! file_exists(public_path().'/receipts/sale') ) mkdir( public_path()."/receipts/sale" );
                if(! file_exists(public_path()."/receipts/sale/{$saleId}") ) mkdir( public_path()."/receipts/sale/{$saleId}" );

                $storagePath = public_path()."/receipts/sale/{$saleId}/{$saleId}.pdf";

                $templatePath = public_path().'/receipts/template.html';

                if( $this->generateReceipt( $this->bookData ) ) $this->savePdf( public_path().'/receipts/template.html', $storagePath );

            } catch (Exception $e) {
                    DB::rollback();
                    Log::error("Exception caught, filename: " . $e->getFile() . " on line: " . $e->getLine());
                    Log::error($e->getMessage());
                    return response()->json(['error' => 'Error recording book sale...'], 422);
            }

            DB::commit();

            return response()->json(
                                        [
                                            'success' => 'Book sale recorded successfully. A sales receipt will be generated shortly.',
                                            'receipt_path' => $storagePath
                                        ], 
                                        200
                                    );
            

        }catch(\Exception $e) {
            DB::rollback();
            Log::error("Exception caught, filename: " . $e->getFile() . " on line: " . $e->getLine());
            Log::error($e->getMessage());
            return response()->json(["error" => "Something unusual happened"], 500);
        }
    }

    private function generateReceipt(
                                        $cart,
                                        $customerName = 'NIL',
                                        $customerEmail = 'NIL', 
                                        $companyName = 'Holy Child', 
                                        $companyWebsite = 'www.holychildacademy.org', 
                                        $companyEmail = 'holychildac@gmail.com',
                                        $paymentType = 'Cash'
                                    ){
        
        $logoPath = public_path()."/images/home/gallery1.jpg";

        $receiptDate = Carbon::now();

        $template = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
                    <!-- saved from url=(0041)http://mygreenhat.com/sample_invoice.html -->
                    <html><head><meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
                    <title>Sales Receipt</title>
                    <style type="text/css">
                    <!--
                    body {font-family:Tahoma;}
                    img {border:0;}
                    #page {width:800px;margin:0 auto;padding:15px;}
                    #logo {float:left;margin:0;}
                    #address {height:181px;margin-left:250px;}
                    table {width:100%;}
                    td {padding:5px;}
                    tr.odd {background:#e1ffe1;}
                    -->
                    </style>
                    </head>';

        $template .= '<body><div id="page"><div id="logo">';

        $template .= "<a href='{$companyWebsite}'><img src='{$logoPath}'></a>";
        $template .= '</div><!--end logo--><div id="address">';

        $template .=   "<p>{$companyName}<br>";

        $template .=   "<a href='mailto:{$companyEmail}'>{$companyEmail}</a>";

        $template .=   "<br><br>Transaction # xxx<br>Created on {$receiptDate}<br></p></div><!--end address-->";

        $template .=   '<div id="content"><p><strong>Customer Details</strong><br>';

        $template .=   "Name: {$customerName}<br> Email: {$customerEmail}<br> Payment Type: {$paymentType}</p>";
        
        $template .=   '<hr><table><tbody>
                    <tr>
                        <td><strong>Description</strong></td>
                        <td><strong>Qty</strong></td>
                        <td><strong>Unit Price</strong></td>
                        <td><strong>Amount</strong></td>
                    </tr>';

        $num = 0; $total = 0; $myClass = 'odd';

        foreach ($cart as $product) {

            $num += 1; $total += (int)$product['cart_total'];

            if($num%2 == 0) $myClass = 'even';else $myClass = 'odd';

            $template .= "<tr class='{$myClass}'>
                        <td>{$product['title']}</td>
                        <td>{$product['cart_quantity']}</td>
                        <td>{$product['sales_price']}</td>
                        <td>{$product['cart_total']}</td>
                     </tr>";
        }           

        $template .= "  <tr><td>&nbsp;</td><td>&nbsp;</td><td><strong>Total</strong></td>
                    <td><strong>{$total}</strong></td></tr>
                    </tbody>
                    </table>
                        <hr>
                        <p>
                        Thank you for your order!  This transaction will appear on your billing statement as {$customerName}.<br>
                        If you have any questions, please feel free to contact us at <a href=mailto:{$companyEmail}'>{$companyEmail}</a>.
                        </p><hr><p>
                        </p><center><small>This communication is for the exclusive use of the addressee and may contain proprietary, confidential or privileged information. 
                        If you are not the intended recipient any use, copying, disclosure, dissemination or distribution is strictly prohibited.
                        <br><br>
                        © {$companyName} All Rights Reserved
                        </small></center>
                        <p></p>
                    </div><!--end content-->
                    </div><!--end page-->

                    </body></html>";
        
        if( $handle = @fopen(public_path().'/receipts/template.html','w') ){
            @fwrite($handle, $template);
            @fclose($handle);
        }else{
            throw new Exception("Error writing receipt data...", 1);
            return false;
        }
        
        return true;
    }

    private function savePdf($template, $storagePath){

        PDF::loadFile( $template )->save( $storagePath );

    }

    public function download(Request $request){
        try{

            $path = $request->get('path');

            if(!file_exists($path)) return response()->json( ['error'=>'File not found...'] , 422 );

            $file = base64_encode( file_get_contents($path) );

            return response()->json( compact('file'), 200 );

        }catch(\Exception $e){
            Log::error("Exception caught, filename: " . $e->getFile() . " on line: " . $e->getLine());
            Log::error($e->getMessage());
            return response()->json(["error" => "Something unusual happened"], 500);
        }
    }
}
