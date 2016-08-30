<?php

/*
|--------------------------------------------------------------------------
| Routes File
|--------------------------------------------------------------------------
|
| Here is where you will register all of the routes in an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

// Route::get('/{any?}', [
//     'uses' => 'ExampleControllers\AngularRoutesController@index',
//     'as' => 'home'
// ]);

Route::get('/', function(){
    return view('content');
});

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| This route group applies the "web" middleware group to every route
| it contains. The "web" middleware group is defined in your HTTP
| kernel and includes session state, CSRF protection, and more.
|
*/

Route::group(['prefix' => 'api'], function () {

    Route::resource('books', 'BookController');
    Route::resource('suppliers', 'SupplierController');
    Route::resource('categories', 'CategoryController');
    Route::resource('levels', 'LevelController');

    Route::get('logout/{id}', 'AuthenticateController@logout');
    Route::post('authenticate', 'AuthenticateController@authenticate');
    Route::resource('authenticate', 'AuthenticateController', ['only' => ['index']]);
    
});

// API route
//Route::post('/api/upload-file', 'ExampleControllers\UploadController@uploadFile');

//Route::group(['middleware' => ['web']], function () {
    //
//});





Route::auth();

Route::get('/home', 'HomeController@index');
