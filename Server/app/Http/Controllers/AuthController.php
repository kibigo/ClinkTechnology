<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\WishList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register']]);
    }


    public function register(Request $request)
    {
        $validated_data = Validator::make($request->all(), [
            'first_name' => 'required',
            'last_name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed|string',
            'phone_number' => 'required|numeric'
        ]);   

        if($validated_data->fails())
        {
            return response()->json($validated_data->errors()->toJson(), 400);
        }

        $user = User::create(array_merge(
            $validated_data->validated(),
            ['password' => Hash::make($request->password)],
            ['user_type' => 1]
        ));

        return response()->json([
            'message' => 'working',
            'user' => $user
        ]);
    }


    public function login(Request $request)
    {
        $validated_data = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|min:8|string'
        ]);

        if($validated_data->fails())
        {
            return response()->json($validated_data->errors()->toJson());
        }

        $token = auth()->attempt($validated_data->validated());


        // $user = auth()->user();

        // $otp = random_int(1000, 9999);

        // if($user->user_type == 0)
        // {
        //     return response()->json([
        //         'message' => 'This is admin, needs an authentication password',
        //         'otp' => $otp
        //     ]);
        // }

        if(!$token)
        {
            return response()->json([
                'error' => 'wrong credentials'
            ], 401);
        }

        //store token in session
        session()->put('jwt_token', $token);

        if(Session::has('cart'))
        {
            $this->syncSessionToDatabase(auth()->user()->id);
        }

        return $this->createNewToken($token);
    }

    public function createNewToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'user' => auth()->user()
        ]);
    }


    public function logout()
    {
        auth()->logout();

        //session()->forget('jwt_token');

        return response()->json([
            'message' => 'user logged out'
        ]);
    }

    public function syncSessionToDatabase($id)
    {
        $dataItem = WishList::getCart($id);

        $sessionCart = Session::get('cart', []);

        foreach($dataItem as $item)
        {
            if(isset($sessionCart[$item->product_id]))
            {
                $item->quantity = $sessionCart[$item->product_id]['quantity'];

                $item->save();

                unset($sessionCart[$item->product_id]);
            }
        }

        foreach($sessionCart as $data)
        {
            $new = new WishList();

            $new->product_id = $data['product_id'];
            $new->name = $data['name'];
            $new->user_id = $id;
            $new->price = $data['price'];
            $new->quantity = $data['quantity'];

            $new->save();
        }

        Session::forget('cart');
    }
}







