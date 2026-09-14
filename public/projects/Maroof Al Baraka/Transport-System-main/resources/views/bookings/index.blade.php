@extends('layouts.app')
@section('header_title', 'Manage Booking')
@section('content')
<div class="card">
    <div class="card-header">
        <h2 class="card-title">Booking List</h2>
        <a href="#" data-modal-target="createModal" class="btn btn-primary"><i class="fa-solid fa-plus"></i> Add New</a>
    </div>
    <div class="table-responsive">
        <table>
            <thead>
                <tr>
                    <th>Booking ID</th>
                    <th>Date</th>
                    <th>Pickup time</th>
                    <th>Vendor</th>
                    <th>Route</th>
                    <th>Group name</th>
                    <th>Pax count</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach($bookings as $item)
                <tr>
                    <td data-label="Booking ID">#{{ $item->id }}</td>
                    <td data-label="Date">{{ $item->date }}</td>
                    <td data-label="Pickup time">{{ $item->pickup_time ? \Carbon\Carbon::parse($item->pickup_time)->format('H:i') : 'N/A' }}</td>
                    <td data-label="Vendor">{{ $item->vendor->company_name ?? 'N/A' }}</td>
                    <td data-label="Route">{{ $item->route->route_name ?? 'N/A' }}</td>
                    <td data-label="Group name">{{ $item->group_name }}</td>
                            <td data-label="Pax count">{{ $item->pax_count }}</td>
                            <td data-label="Price">{{ $item->price }}</td>
                            <td data-label="Status">{{ $item->status }}</td>
                    <td data-label="Actions">
                        <a href="#" data-modal-target="editModal" data-record="{{ json_encode($item) }}" data-action-url="{{ route('bookings.update', $item) }}" class="btn btn-secondary">Edit</a>
                        <form action="{{ route('bookings.destroy', $item) }}" method="POST" style="display:inline;">
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
            <h2>Add New Booking</h2>
            <button type="button" class="modal-close"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <form action="{{ route('bookings.store') }}" method="POST">
            @csrf
            <div class="modal-body">
                <div class="form-group">
            <label class="form-label">Date</label>
            <input type="date" name="date" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Pickup time</label>
            <input type="time" name="pickup_time" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Vendor</label>
            <select name="vendor_id" class="form-control">
                <option value="">Select Vendor</option>
                @foreach($vendors as $vendor)
                    <option value="{{ $vendor->id }}">{{ $vendor->company_name }}</option>
                @endforeach
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Route</label>
            <select name="route_id" class="form-control">
                <option value="">Select Route</option>
                @foreach($routes as $route)
                    <option value="{{ $route->id }}">{{ $route->route_name }}</option>
                @endforeach
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Group name</label>
            <input type="text" name="group_name" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Pax count</label>
            <input type="number" name="pax_count" class="form-control" id="create_pax_count">
        </div>
        <div id="createPassengerFields"></div>
        <div class="form-group">
            <label class="form-label">Price</label>
            <input type="number" step="0.01" name="price" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Status</label>
            <select name="status" class="form-control">
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
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
            <h2>Edit Booking</h2>
            <button type="button" class="modal-close"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <form action="" method="POST" id="editForm">
            @csrf
            @method('PUT')
            <div class="modal-body">
                <div class="form-group">
            <label class="form-label">Date</label>
            <input type="date" name="date" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Pickup time</label>
            <input type="time" name="pickup_time" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Vendor</label>
            <select name="vendor_id" class="form-control">
                <option value="">Select Vendor</option>
                @foreach($vendors as $vendor)
                    <option value="{{ $vendor->id }}">{{ $vendor->company_name }}</option>
                @endforeach
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Route</label>
            <select name="route_id" class="form-control">
                <option value="">Select Route</option>
                @foreach($routes as $route)
                    <option value="{{ $route->id }}">{{ $route->route_name }}</option>
                @endforeach
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Group name</label>
            <input type="text" name="group_name" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Pax count</label>
            <input type="number" name="pax_count" class="form-control" id="edit_pax_count">
        </div>
        <div id="editPassengerFields"></div>
        <div class="form-group">
            <label class="form-label">Price</label>
            <input type="number" step="0.01" name="price" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Status</label>
            <select name="status" class="form-control">
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
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

@push('scripts')
<script>
    function renderPassengerFields(containerId, count, passengersData = []) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        for (let i = 0; i < count; i++) {
            let p = passengersData[i] || {name: '', iqama_number: '', phone: '', nationality: '', is_leader: false};
            let isLeader = (p.is_leader == 1 || p.is_leader === true) ? 'checked' : '';
            if(!passengersData.length && i === 0) isLeader = 'checked';

            container.innerHTML += `
                <div class="card mt-3">
                    <div class="card-header bg-light">
                        <strong>Passenger ${i + 1}</strong>
                        <div class="float-end">
                            <input type="radio" name="leader_index" value="${i}" ${isLeader}> <label>Group Leader</label>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-3">
                                <label class="form-label">Name</label>
                                <input type="text" name="passengers[${i}][name]" class="form-control" value="${p.name || ''}" required>
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Nationality</label>
                                <input type="text" name="passengers[${i}][nationality]" class="form-control" value="${p.nationality || ''}">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Iqama/Passport</label>
                                <input type="text" name="passengers[${i}][iqama_number]" class="form-control" value="${p.iqama_number || ''}">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Phone</label>
                                <input type="text" name="passengers[${i}][phone]" class="form-control" value="${p.phone || ''}">
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    document.getElementById('create_pax_count').addEventListener('input', function() {
        renderPassengerFields('createPassengerFields', this.value);
    });

    document.getElementById('edit_pax_count').addEventListener('input', function() {
        renderPassengerFields('editPassengerFields', this.value);
    });

    document.querySelectorAll('[data-modal-target="editModal"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const record = JSON.parse(this.getAttribute('data-record'));
            if(record.passengers) {
                renderPassengerFields('editPassengerFields', record.pax_count, record.passengers);
            } else {
                renderPassengerFields('editPassengerFields', record.pax_count);
            }
        });
    });
</script>
@endpush