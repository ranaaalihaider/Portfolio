@extends('layouts.app')
@section('header_title', 'Create Passenger')
@section('content')
<div class="card">
    <form action="{{ route('passengers.store') }}" method="POST">
        @csrf
        <div class="form-group">
            <label class="form-label">Booking id</label>
            <input type="text" name="booking_id" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" name="email" class="form-control" required>
        </div>
        <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" name="password" class="form-control" required>
        </div>
        <div class="form-group">
            <label class="form-label">Name</label>
            <input type="text" name="name" class="form-control" required>
        </div>
        <div class="form-group">
            <label class="form-label">Passport</label>
            <input type="text" name="passport" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Nationality</label>
            <input type="text" name="nationality" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Phone</label>
            <input type="text" name="phone" class="form-control">
        </div>
        <button type="submit" class="btn btn-primary">Save</button>
        <a href="{{ route('passengers.index') }}" class="btn btn-secondary">Cancel</a>
    </form>
</div>
@endsection