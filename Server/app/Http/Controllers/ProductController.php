<?php

namespace App\Http\Controllers;

use App\Models\Image as ModelsImage;
use App\Models\Product;
use App\Models\ImageModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;

class ProductController extends Controller
{
    public function addProduct(Request $request)
    {
        $validated_data = Validator::make($request->all(), [
            'name' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'quantity' => 'required|numeric',
            'category' => 'required|string'
        ]);

        if($validated_data->fails())
        {
            return response()->json($validated_data->errors()->toJson());
        }

        //get validated data
        $validated_data = $validated_data->validated();
        
        $product = Product::create($validated_data);

        $product_id = $product->id;

        return $this->addImage($request, $product_id);
    }


    public function addImage($request, $product_id)
    {
        $request->validate([
            'files.*' => 'required|mimes:jpg,jpeg,png,pdf|max:2048'
        ]);

        if ($request->hasFile('files')) 
        {
            
            foreach ($request->file('files') as $file) 
            {
                // Generate a unique name for each file
                $filename = time() . '_' . $file->getClientOriginalName();
                // Move the file to the uploads directory
                $path = public_path('upload/') . $filename;
                //$file->move();

                Image::make($file)->resize(800, 800, function ($constraint){
                    $constraint->aspectRatio();
                })->save($path, 75);

                // Save file information to the database
                ImageModel::create([
                    'product_id' => $product_id,
                    'path' => $filename,
                ]);
            }

            return response()->json([
                'message' => 'Image added'
            ]);
        }

        return response()->json([
            'message' => 'Files not'
        ]);
    }



    public function allProducts()
    {
        $products = Product::getProduct();

        return response()->json($products);
    }


    public function productSingle($id)
    {
        $singleProduct = Product::getSingle($id);

        return response()->json($singleProduct);
    }
}
