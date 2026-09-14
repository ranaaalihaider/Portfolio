<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function index()
    {
        $settings = Setting::pluck('value', 'key')->toArray();
        return view('admin.settings', compact('settings'));
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'app_name' => 'required|string|max:255',
            'sidebar_bg' => 'required|string',
            'primary_color' => 'required|string',
            'whatsapp_number' => 'nullable|string|max:20',
            'hero_image' => 'nullable|image|max:2048',
            'app_logo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('hero_image')) {
            $image = $request->file('hero_image');
            $filename = time() . '_hero_' . $image->getClientOriginalName();
            $image->move(public_path('uploads/settings'), $filename);
            $data['hero_image'] = 'uploads/settings/' . $filename;
        }

        if ($request->hasFile('app_logo')) {
            $image = $request->file('app_logo');
            $filename = time() . '_logo_' . $image->getClientOriginalName();
            $image->move(public_path('uploads/settings'), $filename);
            $data['app_logo'] = 'uploads/settings/' . $filename;
        }

        foreach ($data as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        return back()->with('success', 'Settings updated successfully.');
    }
}
