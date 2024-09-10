<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Invoice #6</title>

    <style>
        html,
        body {
            margin: 10px;
            padding: 10px;
            font-family: sans-serif;
        }
        h1,h2,h3,h4,h5,h6,p,span,label {
            font-family: sans-serif;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 0px !important;
        }
        table thead th {
            height: 28px;
            text-align: left;
            font-size: 16px;
            font-family: sans-serif;
        }
        table, th, td {
            border: 1px solid #ddd;
            padding: 8px;
            font-size: 14px;
        }

        .heading {
            font-size: 24px;
            margin-top: 12px;
            margin-bottom: 12px;
            font-family: sans-serif;
        }
        .small-heading {
            font-size: 18px;
            font-family: sans-serif;
        }
        .total-heading {
            font-size: 18px;
            font-weight: 700;
            font-family: sans-serif;
        }
        .order-details tbody tr td:nth-child(1) {
            width: 20%;
        }
        .order-details tbody tr td:nth-child(3) {
            width: 20%;
        }

        .text-start {
            text-align: left;
        }
        .text-end {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .company-data span {
            margin-bottom: 4px;
            display: inline-block;
            font-family: sans-serif;
            font-size: 14px;
            font-weight: 400;
        }
        .no-border {
            border: 1px solid #fff !important;
        }
        .bg-blue {
            background-color: #414ab1;
            color: #fff;
        }
    </style>
</head>
<body>

    <table class="order-details">
        <thead>
            <tr>
                <th width="50%" colspan="2">
                    <h2 class="text-start">Clink Technology</h2>
                </th>
                <th width="50%" colspan="2" class="text-end company-data">
                    <span>Invoice {{$order[0]->id}}</span> <br>
                    <span>Date: 24 / 09 / 2022</span> <br>
                    <span>Zip code : 560077</span> <br>
                    <span>Address: Nairobi</span> <br>
                </th>
            </tr>
            <tr class="bg-blue">
                <th width="50%" colspan="2">Order Details</th>
                <th width="50%" colspan="2">User Details</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Order Id:</td>
                <td>{{$order[0]->id}}</td>

                <td>Full Name:</td>
                <td>{{$order[0]->firstName}} {{$order[0]->lastName}}</td>
            </tr>
            <tr>
                <td>Tracking Id/No.:</td>
                <td>CUI#133</td>

                <td>Email Id:</td>
                <td>{{$order[0]->email}}</td>
            </tr>
            <tr>
                <td>Ordered Date:</td>
                <td>{{$order[0]->created_at->format('d-m-Y h:i A')}}</td>

                <td>Phone:</td>
                <td>{{$order[0]->phoneNumber}}</td>
            </tr>
            <tr>
                <td>Payment Mode:</td>
                <td>Cash on Delivery</td>

                <td>Address:</td>
                <td>Nairobi</td>
            </tr>
            <tr>
                <td>Order Status:</td>
                <td>completed</td>

                <td>Pin code:</td>
                <td>566999</td>
            </tr>
        </tbody>
    </table>

    <table>
        <thead>
            <tr>
                <th class="no-border text-start heading" colspan="5">
                    Order Items
                </th>
            </tr>
            <tr class="bg-blue">
                <th>ID</th>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>


            @php
                $totalPrice = 0;
            @endphp



            @foreach ($order[0]['order_items'] as $orderItem)
            
            <tr>

                <td width="10%">{{$orderItem['id']}}</td>
                <td>
                    {{$orderItem['name']}}
                </td>

                <td width="10%">{{$orderItem['price']}}</td>
                <td width="10%">{{$orderItem['quantity']}}</td>
                <td width="15%">{{$orderItem['quantity'] * $orderItem['price']}}</td>

                @php
                  $totalPrice += $orderItem['quantity'] * $orderItem['price'];  
                @endphp
            </tr>
            @endforeach



            <tr>
                <td colspan="5" class="fw-bold">Total Amount:</td>
                <td colspan="1" class="fw-bold">{{$totalPrice}}</td>
            </tr>
        </tbody>
    </table>

    <br>
    <p class="text-center">
        Thank your for shopping with Clink Technology
    </p>

</body>
</html>