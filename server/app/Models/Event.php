<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'title', 'date', 'time', 'location', 
        'category', 'attendees', 'image', 'featured'
    ];

    protected $casts = [
        'featured' => 'boolean',
    ];
}
