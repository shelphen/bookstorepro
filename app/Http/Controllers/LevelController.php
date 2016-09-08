<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Level;

use Log;

use App\Http\Requests\LevelRequest;

class LevelController extends Controller
{

    private $level;

    public function __construct(Level $level){
        $this->middleware('jwt.auth', []);
        $this->level =$level;
    }
    
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try{

            if( $levels = $this->level->with('bookCountRelation')->get() ) return response()->json(compact('levels'), 200); 
                else return response()->json(['error'=>'Error fetching levels list...'], 401);

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
    public function store(LevelRequest $request)
    {
        try{
                
                if( Level::updateOrCreate( ['id' => $request->get('id')], $request->all() ) ){
                    $message = 'Class '. ( ( $request->get('id') > 0 ) ? 'edited' : 'added' ) . ' successfully...';

                    return response()->json(["success" => $message], 200);
                }

                return response()->json(["error" => "Failed to save class..."], 401);

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
        try{

                if( $this->level->where('id', $id)->delete() ) return response()->json(['success' => 'Class removed successfully...' ], 200);

                return response()->json(['error' => 'Class delete failed...'], 400);

        }catch (Exception $e)
        {
                Log::error("Exception caught, filename: " . $e->getFile() . " on line: " . $e->getLine());
                Log::error($e->getMessage());
                return response()->json(['error' => 'Something unusual happened' ], 500);
        }
    }
}
