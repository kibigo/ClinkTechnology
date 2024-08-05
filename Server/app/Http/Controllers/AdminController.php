<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    public function allUsers()
    {
        $users = User::getUsers();

        return response()->json($users);
    }


    public function singleUser($id)
    {
        $singleUser = User::getSingle($id);

        return response()->json($singleUser);
    }


    public function createUser(Request $request)
    {
        $validatedData = Validator::make($request->all(), [
            'first_name' => 'required',
            'last_name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed|string',
            'phone_number' => 'required|numeric',
            'user_type' => 'required|numeric'
        ]);

        if($validatedData->fails())
        {
            return response()->json($validatedData->errors()->toJson());
        }

        $validatedData = $validatedData->validated();

        $validatedData['password'] = Hash::make($request->password);

        $user = User::create(array_merge($validatedData));

        return response()->json([
            'message' => 'User created',
            'user' => $user
        ]);
    }


    public function editUser($id, Request $request)
    {
        $user = User::find($id);

        if(!$user)
        {
            return response()->json([
                'error' => 'User not found'
            ]);
        }

        $requirements = [
            'first_name' => 'required',
            'last_name' => 'required',
            'email' => 'required|email|unique:users,email,' . $id,
            'phone_number' => 'required|numeric'
        ];

        if($request->filled('password'))
        {
            $requirements['password'] = 'required|min:8|confirmed|string';
        }

        $validated_data = Validator::make($request->all(), $requirements);

        if($validated_data->fails())
        {
            return response()->json($validated_data->errors()->toJson());
        }

        $validated_data = $validated_data->validated();


        if(isset($validated_data['password']))
        {
            $validated_data['password'] = Hash::make($validated_data['password']);
        }

        $user->update($validated_data);


        return response()->json([
            'message' => 'User updated'
        ]);
    }


    public function delete($id)
    {
        $user = User::getSingle($id);

        if(!$user)
        {
            return response()->json([
                'message' => 'User not found'
            ]);
        }

        $user->is_delete = 1;

        $user->save();

        return response()->json([
            'message' => 'User deleted'
        ]);
    }
}
