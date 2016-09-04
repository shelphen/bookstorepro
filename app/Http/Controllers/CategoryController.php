<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Category;

use Log;

use App\Http\Requests\CategoryRequest;

class CategoryController extends Controller
{

    private $category;

    public function __construct(Category $category){
        $this->middleware('jwt.auth', []);
        $this->category = $category;
    }
    
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try{

            if( $categories = $this->category->with('bookCountRelation')->get() ) return response()->json(compact('categories'), 200);
                else return response()->json(['error'=>'Error fetching category list...'], 401);
            

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
    public function store(CategoryRequest $request)
    {
        try{
                
                if( Category::updateOrCreate( ['id' => $request->get('id')], $request->all() ) ){
                    if($request->get('id') > 0) $message = 'Category edited successfully...'; else $message = 'Category saved successfully...';

                    return response()->json(["success" => $message], 200);
                }

                return response()->json(["error" => "Failed to save category..."], 401);

        }catch(\Exception $e) {
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
}
