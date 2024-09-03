<?php

namespace App\Http\Controllers;

use App\Models\Image as ModelsImage;
use App\Models\Product;
use App\Models\ImageModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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
            'category' => 'required|string',
            'file' => 'required|mimes:jpg,jpeg,png,pdf|max:2048'
        ]);

        if($validated_data->fails())
        {
            return response()->json($validated_data->errors()->toJson());
        }

        //get validated data
        $validated_data = $validated_data->validated();
        
        $product = Product::create($validated_data);

        $product_id = $product->id;

        //return $this->addImage($request, $product_id);

        $file = $request->file('file');

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
            

        return response()->json([
            'message' => 'Image added'
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


    public function updateProduct(Request $request)
    {
        $validated_data = Validator::make($request->all(), [
            'id' => 'required|string',
            'name' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'quantity' => 'required|numeric',
            'category' => 'required|string',
            'file' => 'nullable|mimes:jpg,jpeg,png,pdf|max:2048'
        ]);
        //Log::info("This are all requests", $request->all());

        if($validated_data->fails())
        {
            return response()->json($validated_data->errors());
        }
        $productId = $request->id;

        $product = Product::find($productId);

        if(!$product)
        {
            return response()->json([
                'message' => 'Product not found',
                'product id' => $productId
            ],500);
        }

        $product->name = $request->name;
        $product->description = $request->description;
        $product->price = $request->price;
        $product->quantity = $request->quantity;
        $product->category = $request->category;

        $product->save();

        //get the file
        if($request->hasFile('file'))
        {
            //incoming file
            $file = $request->file('file');

            $fileName = time() . '_' . $file->getClientOriginalName();

            $pathName = public_path('upload/') . $fileName;

            //file in database
            $imageExisting = ImageModel::where('product_id', $product->id)->first();

            if($imageExisting)
            {
                $existingPath = public_path('upload') . '/' . $imageExisting->path;

                if(file_exists($existingPath) && $pathName == $existingPath)
                {
                    return "File existing";
                }

                unlink($existingPath);

                Image::make($file)->resize(800, 800, function($constraint){
                    $constraint->aspectRatio();
                })->save($pathName, 75);

                $imageExisting->path = $fileName;

                $imageExisting->save();

            }
            else
            {
                Image::make($file)->resize(800, 800, function($constraint) {
                    $constraint->aspectRatio();
                })->save($pathName, 75);
    
                ImageModel::create([
                    'product_id' => $product->id,
                    'path' => $fileName
                ]);
    
    
                return response()->json([
                    'message' => 'Image added'
                ]);
            }

            return response()->json([
                'file' =>'found'
            ]);

        }

        return response()->json([
            'message' => 'Product updated'
        ]);


    }


    public function deleteProduct($id)
    {
        $product = Product::find($id);

        if(!$product)
        {
            return response()->json([
                'message' => 'Product not found'
            ]);
        }

        $product->is_delete = 1;
        $product->save();

        return response()->json([
            'message' => 'Product deleted'
        ]);
    }
}
