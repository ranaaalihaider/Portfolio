<?php
$entities = [
    'Driver' => [
        'table' => 'drivers',
        'route' => 'drivers',
        'fields' => ['name', 'license_number', 'phone', 'status']
    ],
    'Vehicle' => [
        'table' => 'vehicles',
        'route' => 'vehicles',
        'fields' => ['plate_number', 'model', 'capacity', 'status']
    ],
    'Vendor' => [
        'table' => 'vendors',
        'route' => 'vendors',
        'fields' => ['company_name', 'contact_person', 'phone', 'email', 'status']
    ],
    'Route' => [
        'table' => 'routes',
        'route' => 'routes',
        'fields' => ['route_name', 'from_location', 'to_location', 'distance', 'est_time', 'default_price', 'status']
    ],
    'Booking' => [
        'table' => 'bookings',
        'route' => 'bookings',
        'fields' => ['date', 'vendor_id', 'route_id', 'group_name', 'pax_count', 'price', 'status']
    ],
    'Passenger' => [
        'table' => 'passengers',
        'route' => 'passengers',
        'fields' => ['booking_id', 'name', 'passport', 'nationality', 'phone']
    ],
    'Trip' => [
        'table' => 'trips',
        'route' => 'trips',
        'fields' => ['date', 'booking_id', 'driver_id', 'vehicle_id', 'status', 'details']
    ],
    'Income' => [
        'table' => 'incomes',
        'route' => 'incomes',
        'fields' => ['date', 'source', 'amount', 'method', 'vendor_id', 'details']
    ],
    'Expense' => [
        'table' => 'expenses',
        'route' => 'expenses',
        'fields' => ['date', 'category', 'amount', 'paid_by', 'driver_id', 'vehicle_id', 'details']
    ],
    'DriverPayment' => [
        'table' => 'driver_payments',
        'route' => 'driver-payments',
        'fields' => ['date', 'driver_id', 'type', 'amount', 'method', 'details']
    ]
];

foreach ($entities as $model => $data) {
    $route = $data['route'];
    $var = lcfirst($model);
    $viewDir = __DIR__ . '/resources/views/' . str_replace('-', '_', $route);
    if (!is_dir($viewDir)) mkdir($viewDir, 0777, true);

    $varName = '$' . $var;
    // CONTROLLER
    $controller = <<<PHP
<?php

namespace App\Http\Controllers;

use App\Models\\$model;
use Illuminate\Http\Request;

class {$model}Controller extends Controller
{
    public function index()
    {
        \$$route = $model::all();
        return view(str_replace('-', '_', '$route').'.index', compact('$route'));
    }

    public function create()
    {
        return view(str_replace('-', '_', '$route').'.create');
    }

    public function store(Request \$request)
    {
        $model::create(\$request->all());
        return redirect()->route('$route.index');
    }

    public function edit($model $varName)
    {
        return view(str_replace('-', '_', '$route').'.edit', compact('$var'));
    }

    public function update(Request \$request, $model $varName)
    {
        {$varName}->update(\$request->all());
        return redirect()->route('$route.index');
    }

    public function destroy($model $varName)
    {
        {$varName}->delete();
        return redirect()->route('$route.index');
    }
}
PHP;
    file_put_contents(__DIR__ . "/app/Http/Controllers/{$model}Controller.php", $controller);

    $inputs = implode("\n        ", array_map(function($f) {
        $label = ucfirst(str_replace('_', ' ', $f));
        return "<div class=\"form-group\">
            <label class=\"form-label\">$label</label>
            <input type=\"text\" name=\"$f\" class=\"form-control\">
        </div>";
    }, $data['fields']));

    // INDEX VIEW
    $headers = implode("\n                    ", array_map(function($f) { return "<th>" . ucfirst(str_replace('_', ' ', $f)) . "</th>"; }, $data['fields']));
    $cells = implode("\n                            ", array_map(function($f) use ($var) { return "<td>{{ \$item->$f }}</td>"; }, $data['fields']));

    $indexView = <<<HTML
@extends('layouts.app')
@section('header_title', 'Manage $model')
@section('content')
<div class="card">
    <div class="card-header">
        <h2 class="card-title">$model List</h2>
        <a href="#" data-modal-target="createModal" class="btn btn-primary"><i class="fa-solid fa-plus"></i> Add New</a>
    </div>
    <div class="table-responsive">
        <table>
            <thead>
                <tr>
                    $headers
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach(\$$route as \$item)
                <tr>
                    $cells
                    <td>
                        <a href="#" data-modal-target="editModal" data-record="{{ json_encode(\$item) }}" data-action-url="{{ route('$route.update', \$item) }}" class="btn btn-secondary">Edit</a>
                        <form action="{{ route('$route.destroy', \$item) }}" method="POST" style="display:inline;">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-danger">Delete</button>
                        </form>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>

<!-- Create Modal -->
<div id="createModal" class="modal-overlay">
    <div class="modal-content">
        <div class="modal-header">
            <h2>Add New $model</h2>
            <button type="button" class="modal-close"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <form action="{{ route('$route.store') }}" method="POST">
            @csrf
            <div class="modal-body">
                $inputs
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary modal-close">Cancel</button>
                <button type="submit" class="btn btn-primary">Save</button>
            </div>
        </form>
    </div>
</div>

<!-- Edit Modal -->
<div id="editModal" class="modal-overlay">
    <div class="modal-content">
        <div class="modal-header">
            <h2>Edit $model</h2>
            <button type="button" class="modal-close"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <form action="" method="POST" id="editForm">
            @csrf
            @method('PUT')
            <div class="modal-body">
                $inputs
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary modal-close">Cancel</button>
                <button type="submit" class="btn btn-primary">Update</button>
            </div>
        </form>
    </div>
</div>

@endsection
HTML;
    file_put_contents("$viewDir/index.blade.php", $indexView);

    // CREATE VIEW

    $createView = <<<HTML
@extends('layouts.app')
@section('header_title', 'Create $model')
@section('content')
<div class="card">
    <form action="{{ route('$route.store') }}" method="POST">
        @csrf
        $inputs
        <button type="submit" class="btn btn-primary">Save</button>
        <a href="{{ route('$route.index') }}" class="btn btn-secondary">Cancel</a>
    </form>
</div>
@endsection
HTML;
    file_put_contents("$viewDir/create.blade.php", $createView);

    // EDIT VIEW
    $inputsEdit = implode("\n        ", array_map(function($f) use ($var) {
        $label = ucfirst(str_replace('_', ' ', $f));
        return "<div class=\"form-group\">
            <label class=\"form-label\">$label</label>
            <input type=\"text\" name=\"$f\" class=\"form-control\" value=\"{{ \$$var->$f }}\">
        </div>";
    }, $data['fields']));

    $editView = <<<HTML
@extends('layouts.app')
@section('header_title', 'Edit $model')
@section('content')
<div class="card">
    <form action="{{ route('$route.update', \$$var) }}" method="POST">
        @csrf
        @method('PUT')
        $inputsEdit
        <button type="submit" class="btn btn-primary">Update</button>
        <a href="{{ route('$route.index') }}" class="btn btn-secondary">Cancel</a>
    </form>
</div>
@endsection
HTML;
    file_put_contents("$viewDir/edit.blade.php", $editView);
}
echo "CRUD Scaffolded.";
