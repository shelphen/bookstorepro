<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['category_id','level_id','supplier_id','title','author','batch','price','sales_price','quantity_type','quantity','number_of_boxes','description','image'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [];

    public function category(){

            return $this->hasOne('App\Category','id','category_id');

    }

    public function supplier(){

            return $this->hasOne('App\Supplier','id','supplier_id');

    }

    public function level(){

            return $this->hasOne('App\Level','id','level_id');

    }

    public function setTitleAttribute($value){

            $this->attributes['title'] = ucwords( strtolower( $value ) ); 

    }

    public function setAuthorAttribute($value){

            $this->attributes['author'] = ucwords( strtolower( $value ) ); 

    }

    public function getPriceAttribute($value){

            return (int)$value;
    
    }

    public function getSalesPriceAttribute($value){

            return (int)$value;
    
    }

}
