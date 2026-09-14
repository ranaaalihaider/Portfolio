@extends('layouts.app')
@section('header_title', 'Create Expense')
@section('content')
<div class="card">
    <form action="{{ route('expenses.store') }}" method="POST">
        @csrf
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
            <label class="form-label">Driver id</label>
            <input type="number" name="driver_id" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Vehicle id</label>
            <input type="number" name="vehicle_id" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Details</label>
            <input type="text" name="details" class="form-control">
        </div>
        <button type="submit" class="btn btn-primary">Save</button>
        <a href="{{ route('expenses.index') }}" class="btn btn-secondary">Cancel</a>
    </form>
</div>
@endsection