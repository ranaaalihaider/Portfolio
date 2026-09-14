<?php

namespace App\Http\Controllers;

use App\Models\Income;
use App\Models\Vendor;
use Illuminate\Http\Request;

class IncomeController extends Controller
{
    public function index()
    {
        $incomes = Income::with('vendor')->get();
        $vendors = Vendor::all();
        return view(str_replace('-', '_', 'incomes').'.index', compact('incomes', 'vendors'));
    }

    public function create()
    {
        return view(str_replace('-', '_', 'incomes').'.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'source' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'method' => 'nullable|string|max:255',
            'vendor_id' => 'nullable|exists:vendors,id',
            'details' => 'nullable|string',
        ]);
        Income::create($validated);
        return redirect()->route('incomes.index');
    }

    public function edit(Income $income)
    {
        return view(str_replace('-', '_', 'incomes').'.edit', compact('income'));
    }

    public function update(Request $request, Income $income)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'source' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'method' => 'nullable|string|max:255',
            'vendor_id' => 'nullable|exists:vendors,id',
            'details' => 'nullable|string',
        ]);
        $income->update($validated);
        return redirect()->route('incomes.index');
    }

    public function destroy(Income $income)
    {
        try {
            $income->delete();
            return redirect()->route('incomes.index')->with('success', 'Income deleted successfully.');
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() == "23000") {
                return redirect()->back()->withErrors(['error' => 'Cannot delete this income because it is linked to other data.']);
            }
            return redirect()->back()->withErrors(['error' => 'An error occurred while deleting the income.']);
        }
    }
}