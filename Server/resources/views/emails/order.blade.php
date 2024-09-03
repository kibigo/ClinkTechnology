@component('mail::message')
Hello {{$email}}

<p>Your order has been confirmed. Your order number is {{$orderId}}</p>


@component('mail::button', ['url' => url('/')])
Review your order   
@endcomponent


<p>In case you have any questions or concerns, please contact us.</p>

Thanks,<br>
{{config('app.name')}}
@endcomponent