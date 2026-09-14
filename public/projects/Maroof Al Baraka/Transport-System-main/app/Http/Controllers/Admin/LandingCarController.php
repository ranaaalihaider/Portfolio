<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LandingCar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LandingCarController extends Controller
{
    public function index()
    {
        $landing_cars = LandingCar::orderBy('sort_order')->get();
        return view('admin.landing_cars.index', compact('landing_cars'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'route' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'subtitle' => 'required|string|max:255',
            'label' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $imageName = time().'.'.$request->image->extension();  
            $request->image->move(public_path('images/landing_cars'), $imageName);
            $data['image_path'] = 'images/landing_cars/' . $imageName;
        }

        $data['sort_order'] = $data['sort_order'] ?? 0;

        LandingCar::create($data);

        return redirect()->route('landing-cars.index')->with('success', 'Car added successfully.');
    }

    public function update(Request $request, LandingCar $landing_car)
    {
        $data = $request->validate([
            'route' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'subtitle' => 'required|string|max:255',
            'label' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $imageName = time().'.'.$request->image->extension();  
            $request->image->move(public_path('images/landing_cars'), $imageName);
            $data['image_path'] = 'images/landing_cars/' . $imageName;

            // Optional: delete old image if it exists and isn't a default SVG
            if ($landing_car->image_path && file_exists(public_path($landing_car->image_path))) {
                @unlink(public_path($landing_car->image_path));
            }
        }

        $landing_car->update($data);

        return redirect()->route('landing-cars.index')->with('success', 'Car updated successfully.');
    }

    public function destroy(LandingCar $landing_car)
    {
        if ($landing_car->image_path && file_exists(public_path($landing_car->image_path))) {
            @unlink(public_path($landing_car->image_path));
        }
        $landing_car->delete();

        return redirect()->route('landing-cars.index')->with('success', 'Car deleted successfully.');
    }
}
