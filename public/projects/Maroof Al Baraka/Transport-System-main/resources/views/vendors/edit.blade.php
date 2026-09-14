@extends('layouts.app')
@section('header_title', 'Edit Vendor')
@section('content')
<div class="card">
    <form action="{{ route('vendors.update', $vendor) }}" method="POST">
        @csrf
        @method('PUT')
        <div class="form-group">
            <label class="form-label">Company name</label>
            <input type="text" name="company_name" class="form-control" value="{{ $vendor->company_name }}">
        </div>
        <div class="form-group">
            <label class="form-label">Contact person</label>
            <input type="text" name="contact_person" class="form-control" value="{{ $vendor->contact_person }}">
        </div>
        <div class="form-group">
            <label class="form-label">Phone</label>
            <input type="text" name="phone" class="form-control" value="{{ $vendor->phone }}">
        </div>
        <div class="form-group">
            <label class="form-label">Email</label>
            <input type="text" name="email" class="form-control" value="{{ $vendor->email }}">
        </div>
        <div class="form-group">
            <label class="form-label">Status</label>
            <select name="status" class="form-control">
                <option value="Active" {{ $vendor->status == 'Active' ? 'selected' : '' }}>Active</option>
                <option value="Inactive" {{ $vendor->status == 'Inactive' ? 'selected' : '' }}>Inactive</option>
            </select>
        </div>
        <button type="submit" class="btn btn-primary">Update</button>
        <a href="{{ route('vendors.index') }}" class="btn btn-secondary">Cancel</a>
    </form>
</div>
@endsection