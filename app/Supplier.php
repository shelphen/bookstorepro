<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name','location','contact'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [];

    public function books(){

            return $this->belongsToMany('App\Book', 'supplier_id');

    }

    public function setNameAttribute($value){

                $this->attributes['name'] = ucfirst( strtolower( $value ) ); 

    }

    public function bookCountRelation() {

            return $this->hasMany('App\Book')->selectRaw('supplier_id, count(*) as count')->groupBy('supplier_id');

    }
}
