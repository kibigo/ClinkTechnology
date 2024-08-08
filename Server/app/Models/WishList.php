<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WishList extends Model
{
    use HasFactory;

    protected $table = 'wishlist';

    protected $fillable = [
        'product_id',
        'name',
        'user_id',
        'quantity'
    ];


    static public function getCart($id)
    {
        $data = self::select('wishlist.*')
                            ->where('user_id', '=', $id)
                            ->get();
        return $data;
    }
}
