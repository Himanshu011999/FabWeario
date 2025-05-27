<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use App\Models\Banner;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    public function saveBannerImage(Request $request) {
        $validator = Validator::make($request->all(),[
            'banner_image' => 'required|image|mimes:jpeg,jpg,png,gif'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ],400);
        }

        $bannerImage = $request->file('banner_image');
        $bannerImageName = $request->user()->id . '-' . time() . '.' . $bannerImage->extension();
        $destinationPath = public_path('uploads/banner');
        $outputPath = $destinationPath . '/' . $bannerImageName;

        // Ensure the directory exists
        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0755, true);
        }

        // ✅ Resize using Intervention Image v3
        $manager = new ImageManager(new Driver());
        $image = $manager->read($bannerImage->getPathname());
        $image->cover(1200, 600); // Resize to 1200x600
        $image->save($outputPath); // Save resized image

        $banner = new Banner();
        $banner->banner_image = $bannerImageName; // Save image path in DB
        $banner->uploaded_by = $request->user()->id; // Optional: track who uploaded it
        $banner->save();

        return response()->json([
            'status' => 200,
            'message' => 'Banner has been uploaded Successfully',
            'data' => $banner
        ],200);
    }
}
