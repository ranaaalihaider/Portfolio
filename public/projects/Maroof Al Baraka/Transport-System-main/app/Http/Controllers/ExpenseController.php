<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Driver;
use App\Models\Vehicle;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function index()
    {
        $expenses = Expense::with(['driver', 'vehicle'])->get();
        $drivers = Driver::all();
        $vehicles = Vehicle::all();
        return view(str_replace('-', '_', 'expenses').'.index', compact('expenses', 'drivers', 'vehicles'));
    }

    public function create()
    {
        return view(str_replace('-', '_', 'expenses').'.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'driver_id' => 'nullable|exists:drivers,id',
            'vehicle_id' => 'nullable|exists:vehicles,id',
            'amount' => 'required|numeric|min:0',
            'date' => 'required|date',
            'category' => 'required|string',
            'paid_by' => 'nullable|string',
            'details' => 'nullable|string',
        ]);
        Expense::create($validated);
        return redirect()->route('expenses.index');
    }

    public function edit(Expense $expense)
    {
        return view(str_replace('-', '_', 'expenses').'.edit', compact('expense'));
    }

    public function update(Request $request, Expense $expense)
    {
        $validated = $request->validate([
            'driver_id' => 'nullable|exists:drivers,id',
            'vehicle_id' => 'nullable|exists:vehicles,id',
            'amount' => 'required|numeric|min:0',
            'date' => 'required|date',
            'category' => 'required|string',
            'paid_by' => 'nullable|string',
            'details' => 'nullable|string',
        ]);
        $expense->update($validated);
        return redirect()->route('expenses.index');
    }

    public function destroy(Expense $expense)
    {
        try {
            $expense->delete();
            return redirect()->route('expenses.index')->with('success', 'Expense deleted successfully.');
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() == "23000") {
                return redirect()->back()->withErrors(['error' => 'Cannot delete this expense because it is linked to other data.']);
            }
            return redirect()->back()->withErrors(['error' => 'An error occurred while deleting the expense.']);
        }
    }
}