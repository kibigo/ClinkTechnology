<?php

namespace App\Http\Controllers;

use App\Models\DestinationModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DestinationController extends Controller
{
    public function addDestination(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'region_id' => 'required',
            'name' => 'required|string|unique:destination',
            'price' => 'required|string'
        ]);

        if($validate->fails())
        {
            return response()->json($validate->errors());
        }

        $validatedData = $validate->validated();

        $destination = DestinationModel::create($validatedData);

        return response()->json([
            'message' => 'Destination added',
            'Destination' => $destination
        ]);
    }

    public function editDestination(Request $request, $id)
    {
        $destination = DestinationModel::find($id);

        if(!$destination)
        {
            return response()->json([
                'message' => 'Destination not found'
            ]);
        }

        $validate = Validator::make($request->all(), [
            'region_id' => 'required',
            'name' => 'required|string|unique:destination,name,' . $id,
            'price' => 'required|string'
        ]);

        if($validate->fails())
        {
            return response()->json($validate->errors());
        }

        $validatedData = $validate->validated();

        $destination->update($validatedData);


        return response()->json([
            'message' => 'Product details updated'
        ]);

    }


    public function allDestination()
    {
        return DestinationModel::getDestination();
    }


    public function delete($id)
    {
        $destination = DestinationModel::find($id);

        $destination->delete();

        return response()->json([
            'message' => 'Destination deleted'
        ]);
    }
}
