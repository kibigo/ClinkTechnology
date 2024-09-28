<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReviewModel extends Model
{
    use HasFactory;

    protected $table = 'reviews';

    protected $fillable = [
        'productId',
        'rating'
    ];


    public function products()
    {
        return $this->belongsTo(Product::class, 'productId');
    }

    static public function get()
    {
        return self::select('reviews.*')
                    ->where('isDelete', '=', 0)
                    ->get();
    }

    static public function getToCustomers()
    {
        return self::select('reviews.*')
                    ->where('isDelete', '=', 0)
                    ->where('isApproved', '=', 1)
                    ->get();
    }
}
