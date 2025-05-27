<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductSize;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use App\Models\TempImage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ProductController extends Controller
{
    //This method will return all the products
    public function index() {
        $products = Product::orderBy('created_at','DESC')
                    ->with(['product_images','product_sizes'])
                    ->get();

        return response()->json([
            'status'=> 200,
            'data'=> $products
        ],200); 
    }

    //This method will store a new products
    public function store(Request $request) {
        $validator = Validator::make($request->all(),[
            'title' => 'required',
            'price' => 'required|numeric',
            'category' => 'required|integer',
            'sku' => 'required|unique:products,sku',
            'is_featured' => 'required',
            'status' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ],400);
        }

        $product = new Product();
        $product->title = $request->title;
        $product->price = $request->price;
        $product->compare_price = $request->compare_price;
        $product->category_id = $request->category;
        $product->brand_id = $request->brand;
        $product->sku = $request->sku;
        $product->qty = $request->qty;
        $product->description = $request->description;
        $product->short_description = $request->short_description;
        $product->status = $request->status;
        $product->is_featured = $request->is_featured;
        $product->barcode = $request->barcode;
        $product->save();

        if (!empty($request->sizes)){
            foreach ($request->sizes as $sizeId) {
                $productSize = new ProductSize();
                $productSize->size_id = $sizeId;
                $productSize->product_id = $product->id;
                $productSize->save();
            }
        }

        if (!empty($request->gallery) && is_array($request->gallery)) {
            foreach ($request->gallery as $key => $tempImageId) {
                $tempImage = TempImage::find($tempImageId);
        
                if (!$tempImage || !file_exists(public_path('uploads/temp/' . $tempImage->name))) {
                    continue; // Skip if image doesn't exist
                }
        
                $ext = pathinfo($tempImage->name, PATHINFO_EXTENSION);
                $rand = rand(1000,10000);

                $imageName = $product->id . '-' . $rand . time() . '-' . $key . '.' . $ext;
        
                $imagePath = public_path('uploads/temp/' . $tempImage->name);
        
                // Create the manager once (no need to repeat inside the loop)
                $manager = new ImageManager(new Driver());
        
                // Large thumbnail
                $img = $manager->read($imagePath);
                $img->scaleDown(1200);
                $img->save(public_path('uploads/products/large/' . $imageName));
        
                // Small thumbnail
                $img = $manager->read($imagePath);
                $img->coverDown(400, 460);
                $img->save(public_path('uploads/products/small/' . $imageName));
        
                $productImage = new ProductImage();
                $productImage->image = $imageName;
                $productImage->product_id = $product->id;
                $productImage->save();

                // Set the first image as main product image
                if ($key === 0) {
                    $product->image = $imageName;
                    $product->save();
                }
            }
        }

        return response()->json([
            'status' => 200,
            'message' => 'Product has been created Successfully.'
        ],200);
    }

    //This method will return a single products
    public function show($id) {
        $product = Product::with(['product_images','product_sizes'])
                    ->find($id);

        if ($product == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Product not found.'
            ],404);
        }

        $productSizes = $product->product_sizes()->pluck('size_id');

        return response()->json([
            'status' => 200,
            'data' => $product,
            'productSizes' => $productSizes
        ],200);
    }

    //This method will update a products
    public function update($id, Request $request) {

        $product = Product::find($id);

        if ($product == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Product not found.'
            ],404);
        }

        $validator = Validator::make($request->all(),[
            'title' => 'required',
            'price' => 'required|numeric',
            'category' => 'required|integer',
            'sku' => 'required|unique:products,sku,'.$id,
            'is_featured' => 'required',
            'status' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ],400);
        }

        //Update the product
        $product->title = $request->title;
        $product->price = $request->price;
        $product->compare_price = $request->compare_price;
        $product->category_id = $request->category;
        $product->brand_id = $request->brand;
        $product->sku = $request->sku;
        $product->qty = $request->qty;
        $product->description = $request->description;
        $product->short_description = $request->short_description;
        $product->status = $request->status;
        $product->is_featured = $request->is_featured;
        $product->barcode = $request->barcode;
        $product->save();

        if (!empty($request->sizes)){
            ProductSize::where('product_id',$product->id)->delete();
            foreach ($request->sizes as $sizeId) {
                $productSize = new ProductSize();
                $productSize->size_id = $sizeId;
                $productSize->product_id = $product->id;
                $productSize->save();
            }
        }

        return response()->json([
            'status' => 200,
            'message' => 'Product has been updated Successfully.'
        ],200);
    }

    //This method will delete a products
    public function destroy($id) {
        $product = Product::with('product_images')->find($id);

        if ($product == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Product not found.'
            ],404);
        }

        $product->delete();

        if ($product->product_images) {
            foreach ($product->product_images as $productImage) {
                File::delete(public_path('uploads/products/large/'.$productImage->image));
                File::delete(public_path('uploads/products/small/'.$productImage->image));
            }
        }

        return response()->json([
            'status' => 200,
            'message' => 'Product has been deleted Successfully.'
        ],200);
    }

    public function saveProductImage(Request $request) {
        //Validate the request
        $validator = Validator::make($request->all(),[
            'image' => 'required|image|mimes:jpeg,jpg,png,gif'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ],400);
        }

        //Store the image
        $image = $request->file('image');
        $imageName =$request->product_id. '-' . time() . '.' . $image->extension();

        $manager = new ImageManager(new Driver());
        // Large thumbnail
        $img = $manager->read($image->getPathName());
        $img->scaleDown(1200);
        $img->save(public_path('uploads/products/large/' . $imageName));

        // Small thumbnail
        $img = $manager->read($image->getPathName());
        $img->coverDown(400, 460);
        $img->save(public_path('uploads/products/small/' . $imageName));

        // Insert a record in product_images table
        $productImage = new ProductImage();
        $productImage->image = $imageName;
        $productImage->product_id = $request->product_id;
        $productImage->save();

        return response()->json([
            'status' => 200,
            'message' => 'Image has been uploaded Successfully',
            'data' => $productImage
        ],200);
    }

    public function updateDefaultImage(Request $request) {

        $product = Product::find($request->product_id);
        $product->image = $request->image;
        $product->save();

        return response()->json([
            'status' => 200,
            'message' => 'Product Default Image Changed Successfully'
        ],200);

    }

    public function deleteProductImage($id) {

        $productImage = ProductImage::find($id);
        
        if($productImage == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Image not found'
            ],404);
        }

        File::delete(public_path('uploads/products/large/'.$productImage->image));
        File::delete(public_path('uploads/products/small/'.$productImage->image));

        $productImage->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Product Image deleted Successfully'
        ],200);

    }
}
