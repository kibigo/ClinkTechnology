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

    public function edit(Request $request)
    {

        $item = auth()->user();

        if(!$item)
        {
            return response()->json([
                'message' => 'Unauthorized'
            ]);
        }

        $user = User::find($item->id);

        

        $requirements = [
            'first_name' => 'required',
            'last_name' => 'required',
            'email' => 'required|email|unique:users,email,' . $item->id,
            'phone_number' => 'required|numeric'
        ];

        if($request->filled('password'))
        {
            $requirements['password'] = 'min:8|confirmed|string';
        }

        $validate = Validator::make($request->all(), $requirements);
        

        if($validate->fails())
        {
            return response()->json($validate->errors());
        }


        $validatedData = $validate->validated();


        if(isset($validatedData['password']))
        {
            $validatedData['password'] = Hash::make($validatedData['password']);
        }

        $user->first_name = $validatedData['first_name'];
        $user->last_name = $validatedData['last_name'];
        $user->email = $validatedData['email'];
        $user->phone_number = $validatedData['phone_number'];

        $user->save();

        return response()->json([
            'message' => 'user updated'
        ]);


    }

}
