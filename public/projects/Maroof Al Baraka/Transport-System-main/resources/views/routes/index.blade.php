@extends('layouts.app')
@section('header_title', 'Manage Route')
@section('content')
<div class="card">
    <div class="card-header">
        <h2 class="card-title">Route List</h2>
        <a href="#" data-modal-target="createModal" class="btn btn-primary"><i class="fa-solid fa-plus"></i> Add New</a>
    </div>
    <div class="table-responsive">
        <table>
            <thead>
                <tr>
                    <th>Route name</th>
                    <th>From location</th>
                    <th>To location</th>
                    <th>Distance</th>
                    <th>Est time</th>
                    <th>Default price</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach($routes as $item)
                <tr>
                    <td data-label="Route name">{{ $item->route_name }}</td>
                            <td data-label="From location">{{ $item->from_location }}</td>
                            <td data-label="To location">{{ $item->to_location }}</td>
                            <td data-label="Distance">{{ $item->distance }}</td>
                            <td data-label="Est time">{{ $item->est_time }}</td>
                            <td data-label="Default price">{{ $item->default_price }}</td>
                            <td data-label="Status">{{ $item->status }}</td>
                    <td data-label="Actions">
                        <a href="#" data-modal-target="editModal" data-record="{{ json_encode($item) }}" data-action-url="{{ route('routes.update', $item) }}" class="btn btn-secondary">Edit</a>
                        <form action="{{ route('routes.destroy', $item) }}" method="POST" style="display:inline;">
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
            <h2>Add New Route</h2>
            <button type="button" class="modal-close"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <form action="{{ route('routes.store') }}" method="POST">
            @csrf
            <div class="modal-body">
                <div class="form-group">
            <label class="form-label">Route name</label>
            <input type="text" name="route_name" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">From location</label>
            <input type="text" name="from_location" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">To location</label>
            <input type="text" name="to_location" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Distance</label>
            <input type="number" step="0.01" name="distance" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Est time</label>
            <input type="text" name="est_time" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Default price</label>
            <input type="number" step="0.01" name="default_price" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Status</label>
            <select name="status" class="form-control">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
            </select>
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
            <h2>Edit Route</h2>
            <button type="button" class="modal-close"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <form action="" method="POST" id="editForm">
            @csrf
            @method('PUT')
            <div class="modal-body">
                <div class="form-group">
            <label class="form-label">Route name</label>
            <input type="text" name="route_name" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">From location</label>
            <input type="text" name="from_location" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">To location</label>
            <input type="text" name="to_location" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Distance</label>
            <input type="number" step="0.01" name="distance" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Est time</label>
            <input type="text" name="est_time" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Default price</label>
            <input type="number" step="0.01" name="default_price" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Status</label>
            <select name="status" class="form-control">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
            </select>
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