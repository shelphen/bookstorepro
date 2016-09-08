<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Level extends Model
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

            return $this->belongsToMany('App\Book', 'level_id');

    }

    public function setNameAttribute($value){

                $this->attributes['name'] = ucfirst( strtoupper( $value ) ); 

    }

    public function bookCountRelation() {

            return $this->hasMany('App\Book')->selectRaw('level_id, count(*) as count')->groupBy('level_id');

    }
}
