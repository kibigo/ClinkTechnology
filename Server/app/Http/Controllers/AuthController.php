<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

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

        if(!$token)
        {
            return response()->json([
                'error' => 'wrong credentials'
            ], 401);
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

    public function profile()
    {
        return response()->json(auth()->user());
    }


    public function logout()
    {
        auth()->logout();

        return response()->json([
            'message' => 'user logged out'
        ]);
    }
}
