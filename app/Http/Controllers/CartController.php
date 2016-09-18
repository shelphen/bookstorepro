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
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
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
                 $data = collect( $value )->only(['id', 'cart_quantity','cart_total']);
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
                                //$book->quantity = $book->quantity - $data['cart_quantity'];
                                $book->save();//Update product quantity
                                //DB::table('users')->decrement('votes', 5);
                            }

                        });

                });

                if(! file_exists(public_path().'/receipts'))mkdir( public_path().'/receipts' );
                $pdf = PDF::loadFile( public_path().'/receipts/template.html' )->save(public_path().'/receipts/my_stored_file.pdf')->stream('download.pdf');

            } catch (Exception $e) {
                    DB::rollback();
                    Log::error("Exception caught, filename: " . $e->getFile() . " on line: " . $e->getLine());
                    Log::error($e->getMessage());
                    return response()->json(['error' => 'Error recording book sale...'], 422);
            }

            DB::commit();

            return response()->json(['success' => 'Book sale recorded successfully..'], 200);
            

        }catch(\Exception $e) {
            DB::rollback();
            Log::error("Exception caught, filename: " . $e->getFile() . " on line: " . $e->getLine());
            Log::error($e->getMessage());
            return response()->json(["error" => "Something unusual happened"], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function collections(){

        // 1. Sum of collection------------------------------------------------------------------

        $numbers = collect([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
                ]);

        $sum = $numbers->reduce(function ($sum, $number) {
            return $sum + $number;
        });
        //55

        $sum2 = $numbers->sum();
        //55

        // 1. Sum of collection------------------------------------------------------------------

        // 2. Transform perfoms an action on an original collection.--------------------------------

        $names = collect([
            'Albert', 'Ben', 'Charles', 'Dan', 'Eric', 'Xavier', 'Yuri', 'Zane'
        ]);

        $names->transform(function ($name, $key) {
            return strlen($name);
        });

        $names->toArray();
        //[6, 3, 7, 3, 4, 6, 4, 4,]

        // 2. Transform perfoms an action on an original collection.--------------------------------

        // 3. Map function iterates a collection through a callback function and performs an operation on each value--------------------------------

        $names = collect([
            'Albert', 'Ben', 'Charles', 'Dan', 'Eric', 'Xavier', 'Yuri', 'Zane'
        ]);

        $lengths = $names->map(function ($name, $key) {
            return strlen($name);
        });

        $lengths->toArray();
        //[6, 3, 7, 3, 4, 6, 4, 4,]

        // 3. Map function iterates a collection through a callback function and performs an operation on each value--------------------------------
    }

    private function template(){
        
        $template = '<!doctype html>
                        <html>
                        <head>
                            <meta charset="utf-8">
                            <title>A simple, clean, and responsive HTML invoice template</title>
                            
                            <style>
                            .invoice-box{
                                max-width:800px;
                                margin:auto;
                                padding:30px;
                                border:1px solid #eee;
                                box-shadow:0 0 10px rgba(0, 0, 0, .15);
                                font-size:16px;
                                line-height:24px;
                                font-family:\'Helvetica Neue\', \'Helvetica\', Helvetica, Arial, sans-serif;
                                color:#555;
                            }
                            
                            .invoice-box table{
                                width:100%;
                                line-height:inherit;
                                text-align:left;
                            }
                            
                            .invoice-box table td{
                                padding:5px;
                                vertical-align:top;
                            }
                            
                            .invoice-box table tr td:nth-child(2){
                                text-align:right;
                            }
                            
                            .invoice-box table tr.top table td{
                                padding-bottom:20px;
                            }
                            
                            .invoice-box table tr.top table td.title{
                                font-size:45px;
                                line-height:45px;
                                color:#333;
                            }
                            
                            .invoice-box table tr.information table td{
                                padding-bottom:40px;
                            }
                            
                            .invoice-box table tr.heading td{
                                background:#eee;
                                border-bottom:1px solid #ddd;
                                font-weight:bold;
                            }
                            
                            .invoice-box table tr.details td{
                                padding-bottom:20px;
                            }
                            
                            .invoice-box table tr.item td{
                                border-bottom:1px solid #eee;
                            }
                            
                            .invoice-box table tr.item.last td{
                                border-bottom:none;
                            }
                            
                            .invoice-box table tr.total td:nth-child(2){
                                border-top:2px solid #eee;
                                font-weight:bold;
                            }
                            
                            @media only screen and (max-width: 600px) {
                                .invoice-box table tr.top table td{
                                    width:100%;
                                    display:block;
                                    text-align:center;
                                }
                                
                                .invoice-box table tr.information table td{
                                    width:100%;
                                    display:block;
                                    text-align:center;
                                }
                            }
                            </style>
                        </head>

                        <body>
                            <div class="invoice-box">
                                <table cellpadding="0" cellspacing="0">
                                    <tr class="top">
                                        <td colspan="2">
                                            <table>
                                                <tr>
                                                    <td class="title">
                                                        <img src="http://nextstepwebs.com/images/logo.png" style="width:100%; max-width:300px;">
                                                    </td>
                                                    
                                                    <td>
                                                        Invoice #: 123<br>
                                                        Created: January 1, 2015<br>
                                                        Due: February 1, 2015
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    
                                    <tr class="information">
                                        <td colspan="2">
                                            <table>
                                                <tr>
                                                    <td>
                                                        Next Step Webs, Inc.<br>
                                                        12345 Sunny Road<br>
                                                        Sunnyville, TX 12345
                                                    </td>
                                                    
                                                    <td>
                                                        Acme Corp.<br>
                                                        John Doe<br>
                                                        john@example.com
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    
                                    <tr class="heading">
                                        <td>
                                            Payment Method
                                        </td>
                                        
                                        <td>
                                            Check #
                                        </td>
                                    </tr>
                                    
                                    <tr class="details">
                                        <td>
                                            Check
                                        </td>
                                        
                                        <td>
                                            1000
                                        </td>
                                    </tr>
                                    
                                    <tr class="heading">
                                        <td>
                                            Item
                                        </td>
                                        
                                        <td>
                                            Price
                                        </td>
                                    </tr>
                                    
                                    <tr class="item">
                                        <td>
                                            Website design
                                        </td>
                                        
                                        <td>
                                            $300.00
                                        </td>
                                    </tr>
                                    
                                    <tr class="item">
                                        <td>
                                            Hosting (3 months)
                                        </td>
                                        
                                        <td>
                                            $75.00
                                        </td>
                                    </tr>
                                    
                                    <tr class="item last">
                                        <td>
                                            Domain name (1 year)
                                        </td>
                                        
                                        <td>
                                            $10.00
                                        </td>
                                    </tr>
                                    
                                    <tr class="total">
                                        <td></td>
                                        
                                        <td>
                                        Total: $385.00
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </body>
                        </html>';

                return $template;
    }

    public function download(Request $request){
        try{

            $path = public_path().'/receipts/my_stored_file.pdf';

            if(!file_exists($path)) return response()->json( ['error'=>'File not found...'] , 422 );

            $file = base64_encode( file_get_contents($path) );

            //return response()->file($path);

            //return response()->download($path);

            return response()->json( compact('file'), 200 );
                                //->header('Content-Type', 'application/pdf');

        }catch(\Exception $e){
            Log::error("Exception caught, filename: " . $e->getFile() . " on line: " . $e->getLine());
            Log::error($e->getMessage());
            return response()->json(["error" => "Something unusual happened"], 500);
        }
    }
}
