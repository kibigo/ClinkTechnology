<?php

namespace App\Http\Controllers;

use App\Models\ReviewModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    public function createReview(Request $request)
    {

        $requirements = [
            'productId' => 'required|numeric',
            'rating' => 'required|numeric'
        ];

        if($request->filled('comment'))
        {
            $requirements['comment'] = 'string|max:255';
        }

        $data = Validator::make($request->all(), $requirements);

        if($data->fails())
        {
            return response()->json($data->errors());
        }

        $validated = $data->validated();

        $review = new ReviewModel();

        $review->productId = $validated['productId'];
        $review->rating = $validated['rating'];
        $review->comment = $validated['comment'];

        $review->save();

        return response()->json([
            'message' => 'Review created',
            'data' => $review
        ]);
    }


    public function getReviews(Request $request)
    {
        $reviews = ReviewModel::get();

        return response()->json($reviews);
    }

    public function approveReview(Request $request, $id)
    {
        $review = ReviewModel::where('id', $id)->firstOrFail();

        $review->isApproved = 1;

        $review->save();

        return response()->json([
            'message' => 'Review Approved',
        ]);
    }

    public function getApprovedReviews()
    {
        $data = ReviewModel::getToCustomers();

        return response()->json($data);
    }
}
