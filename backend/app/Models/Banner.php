<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    protected $fillable = ['banner_image', 'uploaded_by'];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute() 
    {
        if ($this->banner_image == "") {
            return "";
        }

        return asset('/uploads/banner/'.$this->banner_image);
    }
}
