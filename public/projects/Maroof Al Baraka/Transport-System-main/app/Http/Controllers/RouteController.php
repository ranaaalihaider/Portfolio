<?php

namespace App\Http\Controllers;

use App\Models\Route;
use Illuminate\Http\Request;

class RouteController extends Controller
{
    public function index()
    {
        $routes = Route::all();
        return view(str_replace('-', '_', 'routes').'.index', compact('routes'));
    }

    public function create()
    {
        return view(str_replace('-', '_', 'routes').'.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'from_location' => 'required|string|max:255',
            'to_location' => 'required|string|max:255',
            'distance' => 'nullable|numeric|min:0',
            'status' => 'required|in:Active,Inactive',
        ]);
        $validated['route_name'] = $validated['from_location'] . ' to ' . $validated['to_location'];
        Route::create($validated);
        return redirect()->route('routes.index')->with('success', 'Route created successfully.');
    }

    public function edit(Route $route)
    {
        return view(str_replace('-', '_', 'routes').'.edit', compact('route'));
    }

    public function update(Request $request, Route $route)
    {
        $validated = $request->validate([
            'from_location' => 'required|string|max:255',
            'to_location' => 'required|string|max:255',
            'distance' => 'nullable|numeric|min:0',
            'status' => 'required|in:Active,Inactive',
        ]);
        $validated['route_name'] = $validated['from_location'] . ' to ' . $validated['to_location'];
        $route->update($validated);
        return redirect()->route('routes.index')->with('success', 'Route updated successfully.');
    }

    public function destroy(Route $route)
    {
        try {
            $route->delete();
            return redirect()->route('routes.index')->with('success', 'Route deleted successfully.');
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() == "23000") {
                return redirect()->back()->withErrors(['error' => 'Cannot delete this route because it is linked to other data.']);
            }
            return redirect()->back()->withErrors(['error' => 'An error occurred while deleting the route.']);
        }
    }
}