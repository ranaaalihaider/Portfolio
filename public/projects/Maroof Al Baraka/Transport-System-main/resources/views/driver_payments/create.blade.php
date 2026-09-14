@extends('layouts.app')
@section('header_title', 'Create DriverPayment')
@section('content')
<div class="card">
    <form action="{{ route('driver-payments.store') }}" method="POST">
        @csrf
        <div class="form-group">
            <label class="form-label">Date</label>
            <input type="date" name="date" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Driver id</label>
            <input type="number" name="driver_id" class="form-control">
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
        <button type="submit" class="btn btn-primary">Save</button>
        <a href="{{ route('driver-payments.index') }}" class="btn btn-secondary">Cancel</a>
    </form>
</div>
@endsection