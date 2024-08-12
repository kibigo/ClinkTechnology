<?php

namespace App\Http\Controllers;

use App\Models\RegionModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RegionController extends Controller
{
    public function addRegion(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'name' => 'required|string|unique:region'
        ]);

        if($validate->fails())
        {
            return response()->json($validate->errors());
        }

        $validatedData = $validate->validated();

        RegionModel::create($validatedData);

        return response()->json([
            'message' => 'Region Added'
        ]);
    }


    public function editRegion(Request $request, $id)
    {
        $region = RegionModel::find($id);

        if(!$region)
        {
            return response()->json([
                'message' => 'Region not found'
            ]);
        }

        $validate = Validator::make($request->all(),[
            'name' => 'required|string'
        ]);


        if($validate->fails())
        {
            return response()->json($validate->errors()->toJson());
        }

        $validatedData = $validate->validated();

        $region->update($validatedData);

        return response()->json([
            'message' => 'Region Updated'
        ]);
    }


    public function getRegion()
    {
        $regions = RegionModel::all();

        return response()->json($regions);
    }


    public function deleteRegion($id)
    {
        $region = RegionModel::find($id);

        if(!$region)
        {
            return response()->json([
                'message' => 'Region not found'
            ]);
        }

        $region->delete();

        return response()->json([
            'message' => 'Region deleted'
        ]);
    }
}
