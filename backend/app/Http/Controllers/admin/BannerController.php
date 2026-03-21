<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use App\Models\TempImage;
use App\Models\Banner;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    public function saveBannerImage(Request $request) {
        // Validate that gallery is required and should be an array
    $validator = Validator::make($request->all(), [
        'gallery' => 'required|array',
        'gallery.*' => 'integer|exists:temp_images,id'
    ]);

    if ($validator->fails()) {
        return response()->json([
            'status' => 400,
            'errors' => $validator->errors()
        ], 400);
    }

    $savedBanners = [];
    $manager = new ImageManager(new Driver());

    foreach ($request->gallery as $tempImageId) {
        $tempImage = TempImage::find($tempImageId);
        
        if ($tempImage) {
            $sourcePath = public_path('uploads/temp/' . $tempImage->name);
            
            // ✅ File must exist and must be readable image
            if (!file_exists($sourcePath)) {
                continue;
            }

            if (!@getimagesize($sourcePath)) {
                continue; // Not a valid image
            }

            try {
                $image = $manager->read($sourcePath);
            } catch (\Intervention\Image\Exceptions\DecoderException $e) {
                continue; // Skip image if decoding fails
            }

            $bannerImageName = $request->user()->id . '-' . time() . '-' . uniqid() . '.' . pathinfo($tempImage->name, PATHINFO_EXTENSION);
            $destinationPath = public_path('uploads/banner');

            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }

            $outputPath = $destinationPath . '/' . $bannerImageName;

            // Resize and save image
            $image->cover(1200, 600);
            $image->save($outputPath);

            // Save to DB
            $banner = new Banner();
            $banner->banner_image = $bannerImageName;
            $banner->uploaded_by = $request->user()->id;
            $banner->save();

            $savedBanners[] = $banner;

            // Clean up temp file
            @unlink($sourcePath);
            $tempImage->delete();
        }
    }


    return response()->json([
        'status' => 200,
        'message' => 'Banner images have been saved successfully.',
        'data' => $savedBanners
    ], 200);
    }
}
