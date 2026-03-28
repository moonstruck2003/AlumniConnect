<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MentorshipRequest extends Model
{
    use HasFactory;

    // Database-e je field gulo amra save korbo
    protected $fillable = [
        'student_id', 
        'alumni_id', 
        'status', 
        'message'
    ];

    // Relation: Ei request-ta kon student pathaise
    public function student() {
        return $this->belongsTo(User::class, 'student_id');
    }

    // Relation: Ei request-ta kon alumni-r kache gese
    public function alumni() {
        return $this->belongsTo(User::class, 'alumni_id');
    }
}