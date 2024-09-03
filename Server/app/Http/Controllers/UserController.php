<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function profile()
    {
        return response()->json(auth()->user());
    }

    public function edit(Request $request, $id)
    {

        $user = User::find($id);

        $requirements = [
            'first_name' => 'required',
            'last_name' => 'required',
            'email' => 'required|email|unique:users,email,' . $id,
            'phone_number' => 'required|numeric'
        ];

        if($request->filled('passwoard'))
        {
            $requirements['password'] = 'min:8|confirmed|string';
        }

        $validate = Validator::make($request->all(), $requirements);
        

        if($validate->fails())
        {
            return response()->json($validate->errors()->toJson());
        }


        $validatedData = $validate->validated();


        if(isset($validatedData['password']))
        {
            $validatedData['password'] = Hash::make($validatedData['password']);
        }


        if($user == auth()->user())
        {
            $user->update($validatedData);

            return response()->json([
                'message' => 'Profile updated'
            ]);
        }

        else
        {
            return response()->json([
                'message' => 'Unauthorized'
            ],403);
        }

    }

}
