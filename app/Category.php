<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [];

    public function books(){

            return $this->belongsToMany('App\Book', 'category_id');

    }

    public function setNameAttribute($value){

                $this->attributes['name'] = ucfirst( strtolower( $value ) ); 

    }

    public function setLocationAttribute($value){

                $this->attributes['location'] = ucfirst( strtolower( $value ) ); 

    }

    public function bookCountRelation() {

            return $this->hasMany('App\Book')->selectRaw('category_id, count(*) as count')->groupBy('category_id');

    }
}
