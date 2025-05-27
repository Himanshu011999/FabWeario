<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    public function getAllBanners() {
        $banners = Banner::latest()->take(5)->get(['id', 'banner_image']);

        return response()->json([
            'status' => 200,
            'data' => $banners
        ], 200);
    }

}
