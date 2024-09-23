<?php

namespace App\Http\Controllers;

use App\Models\ReviewModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    public function createReview(Request $request)
    {
        $data = Validator::make($request->all(), [
            'productId' => 'required|numeric',
            'rating' => 'required|numeric'
        ]);

        if($data->fails())
        {
            return response()->json($data->errors());
        }

        $validated = $data->validated();

        $review = ReviewModel::create($validated);

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
}
