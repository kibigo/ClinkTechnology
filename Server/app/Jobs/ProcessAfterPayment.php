<?php

namespace App\Jobs;

use App\Mail\OrderMail;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ProcessAfterPayment implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */


    //protected $paymentDetails;
    protected $item;
    protected $user;
    protected $orderId;
    protected $email;

    public function __construct($item, $user, $orderId)
    {
        //$this->paymentDetails = $paymentDetails;
        $this->item = $item;
        $this->user = $user;
        $this->orderId = $orderId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Log::info('Process', [
        //     'item' => $this->item,
        //     'user' => $this->user,
        //     'orderId' => $this->orderId
        // ]);
        $orderItem = new OrderItem;

        $orderItem->name = $this->item->name;
        $orderItem->productId = $this->item->product_id;
        $orderItem->price = $this->item->price;
        $orderItem->quantity = $this->item->quantity;
        $orderItem->orderId = $this->orderId;

        $orderItem->save();

        //find user
        //$user = User::find($this->user);


        // Mail::to($this->email)->send(new OrderMail($this->orderId, $this->email));
    }
}


