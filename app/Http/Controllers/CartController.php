<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Book;

use Log;



class CartController extends Controller
{

    protected $book;

    public function __construct(Book $book){
        $this->book = $book;
        $this->middleware('jwt.auth', []);
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
            

            $books = collect( collect( $request->all() )->get('items') )//Get contents using items key
                                                        ->pluck('id','cart_quantity')//Get only id and cart_quantity
                                                        ->toArray();//Convert to array

            try{

                $filtered = $this->book->whereIn('id', array_values($books) )->get()->filter(function ($value, $key) use($books) {
                            if(array_search($value->id, $books) > $value->quantity)
                                throw new \Exception( "The quanity specified for the book ". strtoupper($value->title) ." is more than the items in stock[ {$value->quantity} ] for the product", 1);
                            return $value;
                        });

            }catch(\Exception $e){
                return response()->json(["error" => $e->getMessage()], 422);
            }

            \Log::info( $filtered );
             
            
            return response()->json(['success' => 'Book sale recorded successfully..'], 200);
                //else return response()->json(['error'=>'Error recording book sale...'], 401);
            

        }catch(\Exception $e) {
            Log::error("Exception caught, filename: " . $e->getFile() . " on line: " . $e->getLine());
            Log::error($e->getMessage());
            return response()->json(["error" => "Something unusual happened"], 500);
        }
    }

    private function myCollect($var){
        collect($var);

        return $this;
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
}
