<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'quantity',
        'category',
    ];

    public function images()
    {
        return $this->hasMany(ImageModel::class);
    }


    static public function getProduct()
    {
        $return = Product::select('products.*', 'images.path as image_url')
                            ->join('images', 'images.product_id', 'products.id')
                            ->where('products.is_delete', '=', 0)
                            ->get();
        $formattedProducts = $return->groupBy('id')->map(function($productGroup){
            $product = $productGroup->first();
            $product->images = $productGroup->pluck('image_url');
            return $product;
        });

        return $formattedProducts->values();
    }

    static public function getSingle($id)
    {
        $return = Product::select('products.*', 'images.path as image_url')
                            ->join('images', 'images.product_id', 'products.id')
                            ->where('products.is_delete', '=', 0)
                            ->where('products.id', '=', $id)
                            ->get();

        $formattedProducts = $return->groupBy('id')->map(function($productGroup){
        $product = $productGroup->first();
        $product->images = $productGroup->pluck('image_url');
        return $product;
        });

        return $formattedProducts->values();
    }
}
