<?php

namespace App\Http\Controllers;

use App\Models\DestinationModel;
use App\Models\Product;
use App\Models\WishList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    public function addToCart(Request $request, $product_id)
    {
        if(Auth::check())
        {
            $dataItem = WishList::find($product_id);

            if($dataItem)
            {
                $dataItem->quantity += 1;
                
                $dataItem->save();

                return response()->json([
                    'message' => 'Item added'
                ]);
            }

            WishList::create([
                'product_id' => $dataItem->product_id,
                'name' => $dataItem->name,
                'user_id' => auth()->user()->id,
                'price' => $dataItem->price,
                'quantity' => 1
            ]);
        }

        else
        {
            if (Session::has('cart'))

            {

                $cart = Session::get('cart');

                if(array_key_exists($product_id, $cart))
                {
                    $cart[$product_id]['quantity'] += 1;

                    Session::put('cart', $cart);

                    return response()->json([
                        'message' => 'cart updated',
                        'cart' => $cart
                    ]);
                }

                $product = Product::find($product_id);

                if($product)
                {
                    $cart[$product_id] = [
                        'product_id' => $product_id,
                        'name' => $product->name,
                        'quantity' => 1,
                        'price' => $product->price,
                        'image' => $product->images
                    ];

                    Session::put('cart', $cart);

                    return response()->json([
                        'message' => 'cart added',
                        'cart' => Session::get('cart')
                    ]);
                }

            }

            else
            {

                $cart = Session::get('cart',[]);

                $product = Product::find($product_id);

                if($product)
                {
                    $cart[$product_id] = [
                        'product_id' => $product_id,
                        'name' => $product->name,
                        'quantity' => 1,
                        'price' => $product->price,
                        'image' => $product->images
                    ];

                    Session::put('cart', $cart);

                    return response()->json([
                        'message' => 'cart added',
                        'cart' => Session::get('cart')
                    ]);
                }
            }
        }


    }



    public function getCart(Request $request)
    {
        if(Auth::check())
        {
            $userId = auth()->user()->id;

            $data = WishList::getCart($userId);

            $totalAmount = 0;

            foreach($data as $item)
            {
                $amount = $item->price * $item->quantity;

                $totalAmount += $amount;
            }

            if(!$request->destinationId)
            {
                $totalAmount += 0;
            }

            $destination = DestinationModel::find($request->destinationId);

            if(!$destination)
            {
                return response()->json([
                    'message' => 'Destination not found'
                ]);
            }

            $destinationPrice = $destination->price;

            $totalAmount += $destinationPrice;

            return response()->json([
                'data' => $data,
                'total' => $totalAmount
            ]);
        }

        else
        {
            $cart = Session::get('cart');

            $totalAmount = 0;

            foreach($cart as $item)
            {
                $amount = $item['price'] * $item['quantity'];

                $totalAmount += $amount;
            }

            if(!$request->destinationId)
            {
                $totalAmount += 0;
            }

            $destination = DestinationModel::find($request->destinationId);

            if(!$destination)
            {
                return response()->json([
                    'message' => 'Destination not found'
                ]);
            }

            $destinationPrice = $destination->price;

            $totalAmount += $destinationPrice;

            return response()->json([
                'data' => $cart,
                'total' => $totalAmount
            ]);
        }
    }
}




