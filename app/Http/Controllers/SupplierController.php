<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Supplier;

use Log;

use App\Http\Requests\SupplierRequest;

class SupplierController extends Controller
{

    private $supplier;

    public function __construct(Supplier $supplier){
        $this->middleware('jwt.auth', []);
        $this->supplier = $supplier;
    }
    
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try{

            if( $suppliers = $this->supplier->with('bookCountRelation')->get() ) return response()->json(compact('suppliers'), 200); 
                else return response()->json(['error'=>'Error fetching suppliers list...'], 401);

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
    public function store(SupplierRequest $request)
    {
        if( Supplier::updateOrCreate( ['id' => $request->get('id')], $request->all() ) ){
            $message = 'Supplier '. ( ( $request->get('id') > 0 ) ? 'edited' : 'added' ) . ' successfully...';

            return response()->json(["success" => $message], 200);
        }

        return response()->json(["error" => "Failed to save supplier..."], 401);
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

                if( $this->supplier->where('id', $id)->delete() ) return response()->json(['success' => 'Supplier removed successfully...' ], 200);

                return response()->json(['error' => 'Supplier delete failed...'], 400);

        }catch (Exception $e)
        {
                Log::error("Exception caught, filename: " . $e->getFile() . " on line: " . $e->getLine());
                Log::error($e->getMessage());
                return response()->json(['error' => 'Something unusual happened' ], 500);
        }
    }
}
