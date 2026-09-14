@extends('layouts.app')
@section('header_title', 'Edit DriverPayment')
@section('content')
<div class="card">
    <form action="{{ route('driver-payments.update', $driverPayment) }}" method="POST">
        @csrf
        @method('PUT')
        <div class="form-group">
            <label class="form-label">Date</label>
            <input type="date" name="date" class="form-control" value="{{ $driverPayment->date }}">
        </div>
        <div class="form-group">
            <label class="form-label">Driver id</label>
            <input type="number" name="driver_id" class="form-control" value="{{ $driverPayment->driver_id }}">
        </div>
        <div class="form-group">
            <label class="form-label">Type</label>
            <select name="type" class="form-control">
                <option value="Advance" {{ $driverPayment->type == 'Advance' ? 'selected' : '' }}>Advance</option>
                <option value="Salary" {{ $driverPayment->type == 'Salary' ? 'selected' : '' }}>Salary</option>
                <option value="Trip Bonus" {{ $driverPayment->type == 'Trip Bonus' ? 'selected' : '' }}>Trip Bonus</option>
                <option value="Deduction" {{ $driverPayment->type == 'Deduction' ? 'selected' : '' }}>Deduction</option>
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Amount</label>
            <input type="number" step="0.01" name="amount" class="form-control" value="{{ $driverPayment->amount }}">
        </div>
        <div class="form-group">
            <label class="form-label">Method</label>
            <select name="method" class="form-control">
                <option value="">Select Method (Optional)</option>
                <option value="Cash" {{ $driverPayment->method == 'Cash' ? 'selected' : '' }}>Cash</option>
                <option value="Bank Transfer" {{ $driverPayment->method == 'Bank Transfer' ? 'selected' : '' }}>Bank Transfer</option>
                <option value="Card" {{ $driverPayment->method == 'Card' ? 'selected' : '' }}>Card</option>
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Details</label>
            <input type="text" name="details" class="form-control" value="{{ $driverPayment->details }}">
        </div>
        <button type="submit" class="btn btn-primary">Update</button>
        <a href="{{ route('driver-payments.index') }}" class="btn btn-secondary">Cancel</a>
    </form>
</div>
@endsection