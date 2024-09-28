<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\DestinationController;
use App\Http\Controllers\MpesaController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RegionController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ShipmentController;
use App\Http\Controllers\UserController;
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
    Route::get('/profile', [UserController::class, 'profile']);
    Route::post('/editprofile', [UserController::class, 'edit']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/paylater', [MpesaController::class, 'payLater']);
});


//admin routes

Route::group(['middleware' => ['api', 'admin']], function() {

    //users
    Route::get('/allusers', [AdminController::class, 'allUsers']);
    Route::get('/singleuser/{id}', [AdminController::class, 'singleUser']);
    Route::post('/createuser', [AdminController::class, 'createUser']);
    Route::post('/updateuser/{id}', [AdminController::class, 'updateUser']);
    Route::post('/delete/{id}', [AdminController::class, 'delete']);

    //products
    Route::post('/addproduct', [ProductController::class, 'addProduct']);
    Route::post('/updateproduct', [ProductController::class, 'updateProduct']);
    Route::delete('/deleteproduct/{id}', [ProductController::class, 'deleteProduct']);

    //regions
    Route::post('/addregion', [RegionController::class, 'addRegion']);
    Route::post('/editregion/{id}', [RegionController::class, 'editRegion']);
    Route::delete('/deleteregion/{id}', [RegionController::class, 'deleteRegion']);

    //destinations
    Route::post('/adddestination', [DestinationController::class, 'addDestination']);
    Route::post('/editdestination/{id}', [DestinationController::class, 'editDestination']);
    Route::delete('/deletedestination/{id}', [DestinationController::class, 'delete']);

    //orders
    Route::get('orders', [OrderController::class, 'order']);
    //view items in the order, shipment details
    Route::get('orders/{id}', [OrderController::class, 'singleOrderItems']);
    //single order item
    Route::get('orderitem/{id}', [OrderController::class, 'singleItem']);
    Route::post('updateorderitem/{id}', [OrderController::class, 'updateSingleItem']);
    Route::delete('deleteorderitem/{id}', [OrderController::class, 'deleteOrderItem']);
    //update order status
    Route::post('updateorderstatus/{id}', [OrderController::class, 'updateOrderStatus']);

    //Shipment
    Route::get('shipment/{id}', [ShipmentController::class, 'getShipment']);

    //increase & decrease the quantity
    Route::post('addquantity/{itemId}', [OrderController::class, 'addQuantity']);
    Route::post('subtractquantity/{itemId}', [OrderController::class, 'subtractQuantity']);
    
    //delete orderItem, admin editing
    Route::post('deleteOrderItem/{itemId}', [OrderController::class, 'delete']);

    //get all reviews
    Route::get('/getreviews', [ReviewController::class, 'getReviews']);
    //approve a review
    Route::post('approvereview/{id}', [ReviewController::class, 'approveReview']);
    
});

//users routes




//users routes
Route::get('/products', [ProductController::class, 'allProducts']);
Route::get('/products/{id}', [ProductController::class, 'productSingle']);
Route::post('/addcart/{id}', [CartController::class, 'addToCart']);
Route::post('/getcart', [CartController::class, 'getCart']);

//regions
Route::get('/getregion', [RegionController::class, 'getRegion']);


//destination
Route::get('/alldestination', [DestinationController::class, 'allDestination']);

//add reviews
Route::post('/addreview', [ReviewController::class, 'createReview']);
Route::get('allapproved', [ReviewController::class, 'getApprovedReviews']);


//pay later


//mpesa
// Route::post('/payments/initiatepush', [MpesaController::class, 'initiateStkPush']);
// Route::post('/payments/stkcallback', [MpesaController::class, 'stkCallback']);


Route::controller(MpesaController::class)
->prefix('payments')
->as('payments')
->group(function(){
    Route::get('token', 'token')->name('token');
    Route::post('/initiatepush', 'initiateStkPush');
    Route::post('stkcallback', 'stkCallback'); 
    Route::get('/stkquery', 'stkQuery')->name('stkquery');
});



Route::get('invoice/{id}', [OrderController::class, 'viewInvoice']);