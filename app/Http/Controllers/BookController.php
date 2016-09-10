<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Http\Requests\BookRequest;

use App\Book;

use Log;

use DB;

use Image;

use PDO;

class BookController extends Controller
{

    private $book;



    public function __construct(Book $book){
        $this->middleware('jwt.auth', []);
        $this->book = $book;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try{
                //DB::connection()->setFetchMode(PDO::FETCH_ASSOC);
                
                if( $books = $this->book->with(['category','supplier','level'])->get() ) return response()->json(compact('books'), 200); 
                    else return response()->json(['error'=>'Error fetching book list...'], 401);
                        

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
    public function store(BookRequest $request)
    {
        try {

                DB::beginTransaction();

                try {
                        //Log::info(php_ini_loaded_file());
                       $inputs = $request->all();

                       $quantity = 0;
                       $number_of_boxes = 0;

                        //Save book details
                        if( $request->get('quantity_type') == 'box' ){
                            $number_of_boxes = (int)json_decode($inputs['quantity'], true)['number_of_boxes'];
                            $quantity = (int)json_decode($inputs['quantity'], true)['number_of_boxes'] * (int)json_decode($inputs['quantity'], true)['quantity']; 
                        }else{
                            $quantity = (int)json_decode($inputs['quantity'], true)['quantity'];
                        }

                        $inputs["quantity"] = $quantity;
                        
                        unset( $inputs["id"] );
                        unset( $inputs["quantity"] );
                        unset( $inputs["image"] );
                        if( array_key_exists("number_of_boxes", $inputs) ) unset( $inputs["number_of_boxes"] );

                        $inputs['quantity'] = $quantity;
                        $inputs['number_of_boxes'] = $number_of_boxes;
                        $inputs['image'] = '';

                        //$isSaved = with(new Book)->newInstance($inputs, $request->get('id') )->save();
                        Book::updateOrCreate( ['id' => $request->get('id')], $inputs );

                        if($request->get('image') != ''){

                            $bookId  = DB::getPdo()->lastInsertId();

                            //Create book cover images directory
                            if( !file_exists(public_path()."/cover_images/book/$bookId") ) mkdir(public_path()."/cover_images/book/$bookId", 0777, true);

                            
                            $destinationPath = public_path()."/cover_images/book/$bookId";//File destibation folder
                            
                            $image = $request->file('image');//Save Book Cover Image

                            $img_path = $image->move($destinationPath, $image->getClientOriginalName());

                            $imageUrl = "cover_images/book/$bookId/".$image->getClientOriginalName();
                            
                            //Image::make( $img_path )->resize(200, 285)->save( $img_path );//Resize cover image

                            if( $book = $this->book->find( $bookId ) ) $book->update( ['image' => $imageUrl] );//Update book image url
                        }
                    
                } catch (Exception $e) {
                        DB::rollback();
                        Log::error("Exception caught, filename: " . $e->getFile() . " on line: " . $e->getLine());
                        Log::error($e->getMessage());
                        return response()->json(['error' => 'Book details save failed...'], 400);
                }

                DB::commit();

                $message = 'Book '. ( ( $request->get('id') > 0 ) ? 'edited' : 'added' ) . ' successfully...';

                return response()->json( ['success' =>  $message], 200);

        } catch (Exception $e) {
                    DB::rollback();
                    Log::error("Exception caught, filename: " . $e->getFile() . " on line: " . $e->getLine());
                    Log::error($e->getMessage());
                    return response()->json(['error' => 'Something unusual happened' ], 500);
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
        try{

                if( $this->book->where('id', $id)->delete() ) return response()->json(['success' => 'Book removed successfully...' ], 200);

                return response()->json(['error' => 'Book delete failed...'], 400);

        }catch (Exception $e)
        {
                Log::error("Exception caught, filename: " . $e->getFile() . " on line: " . $e->getLine());
                Log::error($e->getMessage());
                return response()->json(['error' => 'Something unusual happened' ], 500);
        }
    }
}
