<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\DestinationController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RegionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::group(['middleware' => 'api'], function($router) {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('logout', [AuthController::class, 'logout']);
});


//admin routes

Route::group(['middleware' => ['api', 'admin']], function() {

    //users
    Route::get('/allusers', [AdminController::class, 'allUsers']);
    Route::get('/singleuser/{id}', [AdminController::class, 'singleUser']);
    Route::post('/createuser', [AdminController::class, 'createUser']);
    Route::post('/updateuser/{id}', [AdminController::class, 'editUser']);
    Route::post('/delete/{id}', [AdminController::class, 'delete']);

    //products
    Route::post('/addproduct', [ProductController::class, 'addProduct']);


    //regions
    Route::post('/addregion', [RegionController::class, 'addRegion']);
    Route::post('/editregion/{id}', [RegionController::class, 'editRegion']);
    Route::delete('/deleteregion/{id}', [RegionController::class, 'deleteRegion']);

    //destinations
    Route::post('/adddestination', [DestinationController::class, 'addDestination']);
    Route::post('/editdestination/{id}', [DestinationController::class, 'editDestination']);
    Route::delete('/deletedestination/{id}', [DestinationController::class, 'delete']);
    
});



//users routes
Route::get('/products', [ProductController::class, 'allProducts']);
Route::get('/products/{id}', [ProductController::class, 'productSingle']);
Route::post('/addcart/{id}', [CartController::class, 'addToCart']);
Route::get('/getcart', [CartController::class, 'getCart']);

//regions
Route::get('/getregion', [RegionController::class, 'getRegion']);


//destination
Route::get('/alldestination', [DestinationController::class, 'allDestination']);

