<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MpesaModel extends Model
{
    use HasFactory;

    protected $table = 'm_pesa';

    protected $fillable = [
        'phone',
        'amount',
        'reference',
        'description',
        'MerchantRequestID',
        'checkoutRequestID',
        'status',
        'MpesaReceiptNumber',
        'ResultDesc',
        'TransactionDate'
    ];

}
