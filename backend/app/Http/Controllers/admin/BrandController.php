<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    // This method will return all brands
    public function index() {
        $brands = Brand::orderBy('created_at', 'DESC')->get();

        return response()->json([
            'status' => 200,
            'data' => $brands
        ]);
    }

    // This method will store a brand in db
    public function store(Request $request) {
        $validator = Validator::make($request->all(),[
            'name' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $brand = new Brand();
        $brand->name = $request->name;
        $brand->status = $request->status;
        $brand->save();

        return response()->json([
            'status' => 200,
            'message' => 'Brand added Successfully',
            'data' => $brand
        ],200);
    }

    // This method will return a single category
    public function show($id) {
        $brand = Brand::find($id);

        if ($brand == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Brand not found.',
                'data' => []
            ],404);
        }

        return response()->json([
            'status' => 200,
            'data' => $brand
        ]);
    }

    // This method will update a single Brand
    public function update($id, Request $request) {
        $brand = Brand::find($id);

        if ($brand == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Brand not found.',
                'data' => []
            ],404);
        }

        $validator = Validator::make($request->all(),[
            'name' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $brand->name = $request->name;
        $brand->status = $request->status;
        $brand->save();

        return response()->json([
            'status' => 200,
            'message' => 'Brand updated Successfully',
            'data' => $brand
        ],200);
    }

    // This method will destroy a single Brand
    public function destroy($id) {
        $brand = Brand::find($id);

        if ($brand == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Brand not found.',
                'data' => []
            ],404);
        }

        $brand->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Brand deleted Successfully'
        ],200);
    }
}
