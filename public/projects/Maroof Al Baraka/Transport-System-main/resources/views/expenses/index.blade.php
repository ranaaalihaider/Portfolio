@extends('layouts.app')
@section('header_title', 'Manage Expense')
@section('content')
<div class="card">
    <div class="card-header">
        <h2 class="card-title">Expense List</h2>
        <a href="#" data-modal-target="createModal" class="btn btn-primary"><i class="fa-solid fa-plus"></i> Add New</a>
    </div>
    <div class="table-responsive">
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Paid by</th>
                    <th>Driver</th>
                    <th>Vehicle</th>
                    <th>Details</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach($expenses as $item)
                <tr>
                    <td data-label="Date">{{ $item->date }}</td>
                            <td data-label="Category">{{ $item->category }}</td>
                    <td data-label="Amount">${{ number_format($item->amount, 2) }}</td>
                    <td data-label="Paid by">{{ $item->paid_by }}</td>
                    <td data-label="Driver">{{ $item->driver->name ?? '-' }}</td>
                    <td data-label="Vehicle">{{ $item->vehicle->plate_number ?? '-' }}</td>
                    <td data-label="Details">{{ $item->details }}</td>
                    <td data-label="Actions">
                        <a href="#" data-modal-target="editModal" data-record="{{ json_encode($item) }}" data-action-url="{{ route('expenses.update', $item) }}" class="btn btn-secondary">Edit</a>
                        <form action="{{ route('expenses.destroy', $item) }}" method="POST" style="display:inline;">
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
            <h2>Add New Expense</h2>
            <button type="button" class="modal-close"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <form action="{{ route('expenses.store') }}" method="POST">
            @csrf
            <div class="modal-body">
                <div class="form-group">
            <label class="form-label">Date</label>
            <input type="date" name="date" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Category</label>
            <input type="text" name="category" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Amount</label>
            <input type="number" step="0.01" name="amount" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Paid by</label>
            <input type="text" name="paid_by" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Driver</label>
            <select name="driver_id" class="form-control">
                <option value="">Select Driver (Optional)</option>
                @foreach($drivers as $driver)
                    <option value="{{ $driver->id }}">{{ $driver->name }}</option>
                @endforeach
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Vehicle</label>
            <select name="vehicle_id" class="form-control">
                <option value="">Select Vehicle (Optional)</option>
                @foreach($vehicles as $vehicle)
                    <option value="{{ $vehicle->id }}">{{ $vehicle->plate_number }}</option>
                @endforeach
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Details</label>
            <input type="text" name="details" class="form-control">
        </div>
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
            <h2>Edit Expense</h2>
            <button type="button" class="modal-close"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <form action="" method="POST" id="editForm">
            @csrf
            @method('PUT')
            <div class="modal-body">
                <div class="form-group">
            <label class="form-label">Date</label>
            <input type="date" name="date" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Category</label>
            <input type="text" name="category" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Amount</label>
            <input type="number" step="0.01" name="amount" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Paid by</label>
            <input type="text" name="paid_by" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Driver</label>
            <select name="driver_id" class="form-control">
                <option value="">Select Driver (Optional)</option>
                @foreach($drivers as $driver)
                    <option value="{{ $driver->id }}">{{ $driver->name }}</option>
                @endforeach
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Vehicle</label>
            <select name="vehicle_id" class="form-control">
                <option value="">Select Vehicle (Optional)</option>
                @foreach($vehicles as $vehicle)
                    <option value="{{ $vehicle->id }}">{{ $vehicle->plate_number }}</option>
                @endforeach
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Details</label>
            <input type="text" name="details" class="form-control">
        </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary modal-close">Cancel</button>
                <button type="submit" class="btn btn-primary">Update</button>
            </div>
        </form>
    </div>
</div>

@endsection