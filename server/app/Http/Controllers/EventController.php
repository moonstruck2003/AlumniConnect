<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::orderBy('id', 'desc')->get();
        return response()->json($events);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'date' => 'required|string|max:255',
            'time' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'image' => 'nullable|string',
        ]);

        $event = Event::create([
            'title' => $validated['title'],
            'date' => $validated['date'],
            'time' => $validated['time'],
            'location' => $validated['location'],
            'category' => $validated['category'],
            'attendees' => 0,
            'image' => $validated['image'] ?? 'https://images.unsplash.com/photo-1511578334221-6f6f3d24d94b?auto=format&fit=crop&q=80&w=800',
            'featured' => false
        ]);

        return response()->json($event, 201);
    }
}
