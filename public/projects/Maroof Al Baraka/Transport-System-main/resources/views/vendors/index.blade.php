@extends('layouts.app')
@section('header_title', 'Manage Vendor')
@section('content')
<div class="card">
    <div class="card-header">
        <h2 class="card-title">Vendor List</h2>
        <a href="#" data-modal-target="createModal" class="btn btn-primary"><i class="fa-solid fa-plus"></i> Add New</a>
    </div>
    <div class="table-responsive">
        <table>
            <thead>
                <tr>
                    <th>Company name</th>
                    <th>Contact person</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach($vendors as $item)
                <tr>
                    <td data-label="Company name">{{ $item->company_name }}</td>
                            <td data-label="Contact person">{{ $item->contact_person }}</td>
                            <td data-label="Phone">{{ $item->phone }}</td>
                            <td data-label="Email">{{ $item->email }}</td>
                            <td data-label="Status">{{ $item->status }}</td>
                    <td data-label="Actions">
                        <a href="#" data-modal-target="editModal" data-record="{{ json_encode($item) }}" data-action-url="{{ route('vendors.update', $item) }}" class="btn btn-secondary">Edit</a>
                        <form action="{{ route('vendors.destroy', $item) }}" method="POST" style="display:inline;">
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
            <h2>Add New Vendor</h2>
            <button type="button" class="modal-close"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <form action="{{ route('vendors.store') }}" method="POST">
            @csrf
            <div class="modal-body">
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
            <h2>Edit Vendor</h2>
            <button type="button" class="modal-close"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <form action="" method="POST" id="editForm">
            @csrf
            @method('PUT')
            <div class="modal-body">
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
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary modal-close">Cancel</button>
                <button type="submit" class="btn btn-primary">Update</button>
            </div>
        </form>
    </div>
</div>

@endsection