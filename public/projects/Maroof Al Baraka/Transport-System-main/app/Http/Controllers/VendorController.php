<?php

namespace App\Http\Controllers;

use App\Models\Vendor;
use Illuminate\Http\Request;

class VendorController extends Controller
{
    public function index()
    {
        $vendors = Vendor::all();
        return view(str_replace('-', '_', 'vendors').'.index', compact('vendors'));
    }

    public function create()
    {
        return view(str_replace('-', '_', 'vendors').'.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'status' => 'required|in:Active,Inactive',
        ]);
        Vendor::create($validated);
        return redirect()->route('vendors.index');
    }

    public function edit(Vendor $vendor)
    {
        return view(str_replace('-', '_', 'vendors').'.edit', compact('vendor'));
    }

    public function update(Request $request, Vendor $vendor)
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'status' => 'required|in:Active,Inactive',
        ]);
        $vendor->update($validated);
        return redirect()->route('vendors.index');
    }

    public function destroy(Vendor $vendor)
    {
        try {
            $vendor->delete();
            return redirect()->route('vendors.index')->with('success', 'Vendor deleted successfully.');
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() == "23000") {
                return redirect()->back()->withErrors(['error' => 'Cannot delete this vendor because it is linked to other data.']);
            }
            return redirect()->back()->withErrors(['error' => 'An error occurred while deleting the vendor.']);
        }
    }
}