@extends('layouts.app')
@section('header_title', 'Edit Income')
@section('content')
<div class="card">
    <form action="{{ route('incomes.update', $income) }}" method="POST">
        @csrf
        @method('PUT')
        <div class="form-group">
            <label class="form-label">Date</label>
            <input type="date" name="date" class="form-control" value="{{ $income->date }}">
        </div>
        <div class="form-group">
            <label class="form-label">Source</label>
            <input type="text" name="source" class="form-control" value="{{ $income->source }}">
        </div>
        <div class="form-group">
            <label class="form-label">Amount</label>
            <input type="number" step="0.01" name="amount" class="form-control" value="{{ $income->amount }}">
        </div>
        <div class="form-group">
            <label class="form-label">Method</label>
            <select name="method" class="form-control">
                <option value="">Select Method</option>
                <option value="Cash" {{ $income->method == 'Cash' ? 'selected' : '' }}>Cash</option>
                <option value="Bank Transfer" {{ $income->method == 'Bank Transfer' ? 'selected' : '' }}>Bank Transfer</option>
                <option value="Card" {{ $income->method == 'Card' ? 'selected' : '' }}>Card</option>
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Vendor id</label>
            <input type="number" name="vendor_id" class="form-control" value="{{ $income->vendor_id }}">
        </div>
        <div class="form-group">
            <label class="form-label">Details</label>
            <input type="text" name="details" class="form-control" value="{{ $income->details }}">
        </div>
        <button type="submit" class="btn btn-primary">Update</button>
        <a href="{{ route('incomes.index') }}" class="btn btn-secondary">Cancel</a>
    </form>
</div>
@endsection