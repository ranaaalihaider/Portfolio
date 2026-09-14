@extends('layouts.app')
@section('header_title', 'Create Vendor')
@section('content')
<div class="card">
    <form action="{{ route('vendors.store') }}" method="POST">
        @csrf
        <div class="form-group">
            <label class="form-label">Company name</label>
            <input type="text" name="company_name" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Contact person</label>
            <input type="text" name="contact_person" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Phone</label>
            <input type="text" name="phone" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Email</label>
            <input type="text" name="email" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Status</label>
            <select name="status" class="form-control">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
            </select>
        </div>
        <button type="submit" class="btn btn-primary">Save</button>
        <a href="{{ route('vendors.index') }}" class="btn btn-secondary">Cancel</a>
    </form>
</div>
@endsection