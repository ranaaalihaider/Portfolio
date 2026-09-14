@extends('layouts.app')
@section('header_title', 'Manage DriverPayment')
@section('content')
<div class="card">
    <div class="card-header">
        <h2 class="card-title">DriverPayment List</h2>
        <a href="#" data-modal-target="createModal" class="btn btn-primary"><i class="fa-solid fa-plus"></i> Add New</a>
    </div>
    <div class="table-responsive">
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Driver</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Details</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach($driver_payments as $item)
                <tr>
                    <td data-label="Date">{{ $item->date }}</td>
                    <td data-label="Driver">{{ $item->driver->name ?? 'N/A' }}</td>
                    <td data-label="Type">{{ $item->type }}</td>
                    <td data-label="Amount">${{ number_format($item->amount, 2) }}</td>
                            <td data-label="Method">{{ $item->method }}</td>
                            <td data-label="Details">{{ $item->details }}</td>
                    <td data-label="Actions">
                        <a href="#" data-modal-target="editModal" data-record="{{ json_encode($item) }}" data-action-url="{{ route('driver-payments.update', $item) }}" class="btn btn-secondary">Edit</a>
                        <form action="{{ route('driver-payments.destroy', $item) }}" method="POST" style="display:inline;">
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
            <h2>Add New DriverPayment</h2>
            <button type="button" class="modal-close"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <form action="{{ route('driver-payments.store') }}" method="POST">
            @csrf
            <div class="modal-body">
                <div class="form-group">
            <label class="form-label">Date</label>
            <input type="date" name="date" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Driver</label>
            <select name="driver_id" class="form-control">
                <option value="">Select Driver</option>
                @foreach($drivers as $driver)
                    <option value="{{ $driver->id }}">{{ $driver->name }}</option>
                @endforeach
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Type</label>
            <select name="type" class="form-control">
                <option value="Advance">Advance</option>
                <option value="Salary">Salary</option>
                <option value="Trip Bonus">Trip Bonus</option>
                <option value="Deduction">Deduction</option>
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Amount</label>
            <input type="number" step="0.01" name="amount" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Method</label>
            <select name="method" class="form-control">
                <option value="">Select Method (Optional)</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Card">Card</option>
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
            <h2>Edit DriverPayment</h2>
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
            <label class="form-label">Driver</label>
            <select name="driver_id" class="form-control">
                <option value="">Select Driver</option>
                @foreach($drivers as $driver)
                    <option value="{{ $driver->id }}">{{ $driver->name }}</option>
                @endforeach
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Type</label>
            <select name="type" class="form-control">
                <option value="Advance">Advance</option>
                <option value="Salary">Salary</option>
                <option value="Trip Bonus">Trip Bonus</option>
                <option value="Deduction">Deduction</option>
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Amount</label>
            <input type="number" step="0.01" name="amount" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Method</label>
            <select name="method" class="form-control">
                <option value="">Select Method (Optional)</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Card">Card</option>
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