<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessAfterPayment;
use App\Mail\OrderMail;
use App\Models\MpesaModel;
use App\Models\Order;
use App\Models\WishList;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class MpesaController extends Controller
{
    public function token()
    {
        $consumerKey = 'LhGH4PCPimpXc66pjZerRijeJPfHx2IesBx3G7JucuyArrSJ';
        $consumerSecret = 'R88cVacJMJ98Oh9P09Dz3Ak5aBRAOO6GqNSurqGsMiVNmw2cwRGRYz0Ww7Ox1KzO';
        $url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

        $response = Http::withBasicAuth($consumerKey, $consumerSecret)->get($url);


        return $response['access_token'];
    }


    public function initiateStkPush()
    {
        $accessToken = $this->token();
        $url = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
        $passKey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
        $BusinessShortCode = 174379;
        $timeStamp = Carbon::now()->format('YmdHis');
        $password = base64_encode($BusinessShortCode.$passKey.$timeStamp);
        $TransactionType = 'CustomerPayBillOnline';
        $Amount = 1;
        //$phone = ltrim($request->phoneNumber, '0'); //Triming '0' in phone number
        $PartyA = 254724134368;
        $PartyB = 174379;
        $PhoneNumber = 254724134368;
        $callbackUrl = "https://stupid-pets-attack.loca.lt/payments/stkcallback";
        $AccountReference = 'Clink Tech';
        $TransactionDesc = 'Payment for goods';

        try {
            $response = Http::withToken($accessToken)->post($url, [
                'BusinessShortCode' => $BusinessShortCode,
                'Password' => $password,
                'Timestamp' => $timeStamp,
                'TransactionType' => $TransactionType,
                'Amount' => $Amount,
                'PartyA' => $PartyA,
                'PartyB' => $PartyB,
                'PhoneNumber' => $PhoneNumber,
                'CallBackURL' => $callbackUrl,
                'AccountReference' => $AccountReference,
                'TransactionDesc' => $TransactionDesc
            ]);
        } catch (\Throwable $e) {
            return $e->getMessage();
        }

        //return response

        $res = json_decode($response);

        $responseCode = $res->ResponseCode;

        if ($responseCode == 0)
        {
            $MerchantRequestID = $res->MerchantRequestID;
            $CheckoutRequestID = $res->CheckoutRequestID;
            $CustomerMessage = $res->CustomerMessage;


            //save to database
            $payment = new MpesaModel;

            $payment->phone = $PhoneNumber;
            $payment->amount = $Amount;
            $payment->reference = $AccountReference;
            $payment->description = $TransactionDesc;
            $payment->MerchantRequestID = $MerchantRequestID;
            $payment->checkoutRequestID = $CheckoutRequestID;
            $payment->status = 'Requested';

            $payment->save();

            return $CustomerMessage;
        }
        else
        {
            return response()->json([
                'message' => 'Transaction Failed'
            ]);
        }
    }

    public function stkCallback()
    {
        Log::info('Here it is');
        $data = file_get_contents('php://input');
        Storage::disk('local')->put('stk.txt', $data);

        $response = json_decode($data);

        $ResultCode = $response->Body->stkCallback->ResultCode;

        if ($ResultCode == 0)
        {
            //$MerchantRequestID = $response->Body->stkCallback->MerchantRequestID;
            $CheckoutRequestID = $response->Body->stkCallback->CheckoutRequestID;
            $ResultDesc = $response->Body->stkCallback->ResultDesc;
            $Amount = $response->Body->stkCallback->CallbackMetadata->Item[0]->Value;
            $MpesaReceiptNumber = $response->Body->stkCallback->CallbackMetadata->Item[1]->Value;
            //$Balance = $request->Body->stkCallback->CallbackMetadata->Item[2]->value;
            $TransactionDate = $response->Body->stkCallback->CallbackMetadata->Item[3]->Value;
            $PhoneNumber = $response->Body->stkCallback->CallbackMetadata->Item[3]->Value;

            $payment = MpesaModel::where('checkoutRequestID', $CheckoutRequestID)->first();

            $payment->status = 'Paid';
            $payment->TransactionDate = $TransactionDate;
            $payment->MpesaReceiptNumber = $MpesaReceiptNumber;
            $payment->ResultDesc = $ResultDesc;

            $payment->save();


            return $MpesaReceiptNumber;
        }

        else 
        {
            $CheckoutRequestID = $response->Body->stkCallback->CheckoutRequestID;
            $ResultDesc = $response->Body->stkCallback->ResultDesc;
            $payment = MpesaModel::where('checkoutRequestID', $CheckoutRequestID)->first();

            $payment->ResultDesc = $ResultDesc;
            $payment->status = 'Failed';

            $payment->save();
        }
    }

    public function payLater(Request $request)
    {

        $order = new Order;

        $user = auth()->user();
        

        //get products in the wishlist
        $wishlist = WishList::where('user_id', $user->id)->get();

        $price = 0;

        foreach($wishlist as $item)
        {
            $price += $item['price'];
        }

        $email = $user->email;

        $order->totalPrice = $price;
        
        $order->userId = $user->id;

        $transactionId = $request->transaction;

        if($transactionId)
        {
            $order->transactionId = $transactionId;
        }

        $order->save();


        //get the order id
        $orderId = $order->id;



        foreach($wishlist as $item)
        {
            ProcessAfterPayment::dispatch($item, $user, $orderId);
        }

        Mail::to($email)->send(new OrderMail($orderId,$email));


        return response()->json([
            'message' => 'order placed',
            'order' => $order,
            'email' => $email
        ]);
    }
}

