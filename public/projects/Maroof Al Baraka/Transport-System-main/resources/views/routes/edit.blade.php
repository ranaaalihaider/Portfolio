@extends('layouts.app')
@section('header_title', 'Edit Route')
@section('content')
<div class="card">
    <form action="{{ route('routes.update', $route) }}" method="POST">
        @csrf
        @method('PUT')
        <div class="form-group">
            <label class="form-label">Route name</label>
            <input type="text" name="route_name" class="form-control" value="{{ $route->route_name }}">
        </div>
        <div class="form-group">
            <label class="form-label">From location</label>
            <input type="text" name="from_location" class="form-control" value="{{ $route->from_location }}">
        </div>
        <div class="form-group">
            <label class="form-label">To location</label>
            <input type="text" name="to_location" class="form-control" value="{{ $route->to_location }}">
        </div>
        <div class="form-group">
            <label class="form-label">Distance</label>
            <input type="text" name="distance" class="form-control" value="{{ $route->distance }}">
        </div>
        <div class="form-group">
            <label class="form-label">Est time</label>
            <input type="text" name="est_time" class="form-control" value="{{ $route->est_time }}">
        </div>
        <div class="form-group">
            <label class="form-label">Default price</label>
            <input type="text" name="default_price" class="form-control" value="{{ $route->default_price }}">
        </div>
        <div class="form-group">
            <label class="form-label">Status</label>
            <input type="text" name="status" class="form-control" value="{{ $route->status }}">
        </div>
        <button type="submit" class="btn btn-primary">Update</button>
        <a href="{{ route('routes.index') }}" class="btn btn-secondary">Cancel</a>
    </form>
</div>
@endsection