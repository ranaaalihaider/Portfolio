@extends('layouts.app')
@section('header_title', 'Manage Trip')
@section('content')
<div class="card">
    <div class="card-header">
        <h2 class="card-title">Trip List</h2>
        <div>
            @if(request('sort') === 'pickup_time')
                <a href="{{ route('trips.index') }}" class="btn btn-secondary" style="margin-right: 10px;"><i class="fa-solid fa-times"></i> Clear Sort</a>
            @else
                <a href="{{ route('trips.index', ['sort' => 'pickup_time']) }}" class="btn btn-secondary" style="margin-right: 10px;"><i class="fa-solid fa-clock"></i> Sort by Pickup Time</a>
            @endif
            <a href="#" data-modal-target="createModal" class="btn btn-primary"><i class="fa-solid fa-plus"></i> Add New</a>
        </div>
    </div>
    <style>
        .trip-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin-top: 10px;
        }
        .trip-table th {
            background: #f8fafc;
            padding: 14px 16px;
            font-weight: 600;
            color: #475569;
            font-size: 0.85em;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 2px solid #e2e8f0;
            text-align: left;
        }
        .trip-table td {
            padding: 16px;
            background: #ffffff;
            border-bottom: 1px solid #f1f5f9;
            vertical-align: top;
            transition: background 0.2s;
        }
        .trip-table tr:hover td {
            background: #f8fafc;
        }
        .text-main {
            font-weight: 600;
            color: #1e293b;
            font-size: 0.95em;
            margin-bottom: 4px;
        }
        .text-sub {
            color: #64748b;
            font-size: 0.85em;
        }
        .icon-box {
            display: inline-flex;
            width: 24px;
            color: #94a3b8;
        }
        .route-path {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #f0fdf4;
            color: #166534;
            padding: 4px 10px;
            border-radius: 6px;
            font-weight: 500;
            font-size: 0.85em;
            border: 1px solid #bbf7d0;
            margin-top: 6px;
        }
        .action-btns {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
        }
        .btn-mini {
            width: 32px;
            height: 32px;
            border-radius: 6px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border: none;
            color: white;
            cursor: pointer;
            transition: transform 0.1s;
            text-decoration: none;
        }
        .btn-mini:hover {
            transform: scale(1.1);
            opacity: 0.9;
            color: white;
        }
        .btn-wa { background: #25D366; }
        .btn-print { background: #3b82f6; }
        .btn-edit { background: #64748b; }
        .btn-del { background: #ef4444; }
    </style>

    <div class="table-responsive">
        <table class="trip-table">
            <thead>
                <tr>
                    <th>Trip Details</th>
                    <th>Booking & Route</th>
                    <th>Guest Info</th>
                    <th>Assigned Team</th>
                    <th style="width: 140px;">Actions</th>
                </tr>
            </thead>
            <tbody>
                @forelse($trips as $item)
                @php
                    $leader = $item->booking && $item->booking->passengers ? $item->booking->passengers->where('is_leader', true)->first() : null;
                    $leaderName = $leader ? $leader->name : ($item->booking->group_name ?? 'N/A');
                    $leaderIqama = $leader && $leader->iqama_number ? $leader->iqama_number : "";
                    $fromLoc = $item->booking && $item->booking->route ? $item->booking->route->from_location : 'N/A';
                    $toLoc = $item->booking && $item->booking->route ? $item->booking->route->to_location : 'N/A';
                    $vendorName = $item->booking && $item->booking->vendor ? $item->booking->vendor->company_name : 'N/A';
                    $vehicleModel = $item->vehicle ? $item->vehicle->model : 'N/A';
                    $bookingId = $item->booking ? $item->booking->id : 'N/A';
                    
                    $statusColor = match($item->status) {
                        'Scheduled' => 'primary',
                        'In Progress' => 'warning',
                        'Completed' => 'success',
                        'Cancelled' => 'danger',
                        default => 'secondary'
                    };
                @endphp
                <tr>
                    <td data-label="Trip Details">
                        <div class="text-main" style="color: var(--primary);">
                            <i class="fa-regular fa-calendar icon-box"></i> {{ \Carbon\Carbon::parse($item->date)->format('d M Y') }}
                        </div>
                        @if($item->booking && $item->booking->pickup_time)
                        <div class="text-main" style="color: var(--primary); margin-top: 4px;">
                            <i class="fa-regular fa-clock icon-box"></i> {{ \Carbon\Carbon::parse($item->booking->pickup_time)->format('h:i A') }}
                        </div>
                        @endif
                        <span class="badge badge-{{ $statusColor }}" style="margin: 4px 0;">{{ $item->status }}</span>
                        @if($item->details)
                            <div class="text-sub mt-1"><i class="fa-solid fa-note-sticky icon-box"></i> {{ Str::limit($item->details, 30) }}</div>
                        @endif
                    </td>
                    
                    <td data-label="Booking & Route">
                        <div class="text-main">Book #{{ $bookingId }} - {{ $item->booking->group_name ?? 'N/A' }}</div>
                        <div class="text-sub"><i class="fa-solid fa-building icon-box"></i> {{ $vendorName }}</div>
                        <div class="route-path">
                            <span>{{ $fromLoc }}</span>
                            <i class="fa-solid fa-arrow-right" style="opacity: 0.6; font-size: 0.8em;"></i>
                            <span>{{ $toLoc }}</span>
                        </div>
                    </td>
                    
                    <td data-label="Guest Info">
                        <div class="text-main"><i class="fa-solid fa-users icon-box" style="color: var(--primary);"></i> {{ $item->booking->pax_count ?? 0 }} Pax</div>
                        <div class="text-sub"><i class="fa-solid fa-user-tie icon-box"></i> {{ $leaderName }}</div>
                        @if($leaderIqama) 
                            <div class="text-sub"><i class="fa-solid fa-id-card-clip icon-box"></i> {{ $leaderIqama }}</div> 
                        @endif
                    </td>
                    
                    <td data-label="Assigned Team">
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            <div>
                                <div class="text-main"><i class="fa-solid fa-id-card icon-box"></i> {{ $item->driver->name ?? 'Unassigned' }}</div>
                                @if($item->driver) <div class="text-sub" style="padding-left: 24px;">{{ $item->driver->phone }}</div> @endif
                            </div>
                            <div style="border-top: 1px dashed #e2e8f0; padding-top: 8px;">
                                <div class="text-main"><i class="fa-solid fa-van-shuttle icon-box"></i> {{ $item->vehicle->plate_number ?? 'Unassigned' }}</div>
                                @if($item->vehicle) <div class="text-sub" style="padding-left: 24px;">{{ $item->vehicle->model }}</div> @endif
                            </div>
                        </div>
                    </td>
                    
                    <td data-label="Actions">
                        @php
                            $headerText = "🎯 *DROP-OFF COMPLETED*";
                            $footerText = "✅ _Guest dropped off safely._\n⭐ _Service completed!_";

                            if ($item->status === 'Scheduled') {
                                $headerText = "📅 *TRIP SCHEDULED*";
                                $footerText = "✅ _Driver assigned and trip scheduled._\n⭐ _Waiting for departure!_";
                            } elseif ($item->status === 'In Progress') {
                                $headerText = "🚗 *TRIP IN PROGRESS*";
                                $footerText = "✅ _Guest picked up safely._\n⭐ _On the way to destination!_";
                            } elseif ($item->status === 'Cancelled') {
                                $headerText = "❌ *TRIP CANCELLED*";
                                $footerText = "✅ _Trip has been cancelled._\n⭐ _Please contact support for details._";
                            }

                            $msg = "{$headerText}\n\n━━━━━━━━━━━━━━━\n📋 *Booking #{$bookingId}*\n━━━━━━━━━━━━━━━\n\n🏢 *Partner:* {$vendorName}\n👤 *Guest:* {$leaderName}" . ($leaderIqama ? " [{$leaderIqama}]" : "") . "\n📍 *From:* {$fromLoc}\n🎯 *To:* {$toLoc}\n🚗 *Vehicle:* {$vehicleModel}\n\n{$footerText}";
                        @endphp
                        
                        <div class="action-btns">
                            <button type="button" class="btn-mini btn-wa copy-msg-btn" data-msg="{{ $msg }}" title="Copy WhatsApp Message">
                                <i class="fa-brands fa-whatsapp"></i>
                            </button>
                            <a href="{{ route('trips.voucher', $item) }}" target="_blank" class="btn-mini btn-print" title="Print Voucher (Partner)">
                                <i class="fa-solid fa-print"></i>
                            </a>
                            <a href="{{ route('trips.voucher', $item) }}" target="_blank" onclick="showDownloadTip(event, this.href)" class="btn-mini" style="background: #ecfdf5; color: #10b981; border: 1px solid #10b981;" title="Download PDF (Partner)">
                                <i class="fa-solid fa-download"></i>
                            </a>
                            <a href="{{ route('trips.voucher2', $item) }}" target="_blank" class="btn-mini" style="background: #8b5cf6; color: white;" title="Print Voucher (My Company)">
                                <i class="fa-solid fa-print"></i>
                            </a>
                            <a href="{{ route('trips.voucher2', $item) }}" target="_blank" onclick="showDownloadTip(event, this.href)" class="btn-mini" style="background: #ede9fe; color: #8b5cf6; border: 1px solid #8b5cf6;" title="Download PDF (My Company)">
                                <i class="fa-solid fa-download"></i>
                            </a>
                            <button type="button" data-modal-target="editModal" data-record="{{ json_encode($item) }}" data-action-url="{{ route('trips.update', $item) }}" class="btn-mini btn-edit" title="Edit">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <form action="{{ route('trips.destroy', $item) }}" method="POST" style="display:inline; margin: 0;">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn-mini btn-del" title="Delete">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </form>
                        </div>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="5" style="text-align: center; padding: 30px; color: #64748b;">
                        <i class="fa-solid fa-route" style="font-size: 2em; color: #cbd5e1; margin-bottom: 10px;"></i>
                        <div>No trips scheduled yet</div>
                    </td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>

<!-- Create Modal -->
<div id="createModal" class="modal-overlay">
    <div class="modal-content">
        <div class="modal-header">
            <h2>Add New Trip</h2>
            <button type="button" class="modal-close"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <form action="{{ route('trips.store') }}" method="POST">
            @csrf
            <div class="modal-body">
                <div class="form-group">
            <label class="form-label">Date</label>
            <input type="date" name="date" class="form-control">
        </div>
        <div class="form-group">
            <label class="form-label">Booking</label>
            <select name="booking_id" class="form-control">
                <option value="">Select Booking</option>
                @foreach($bookings as $booking)
                    <option value="{{ $booking->id }}">#{{ $booking->id }} - {{ $booking->group_name }}</option>
                @endforeach
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Driver & Vehicle</label>
            <select name="driver_vehicle" class="form-control">
                <option value="">Select Driver & Vehicle</option>
                @foreach($drivers as $driver)
                    @if($driver->vehicle)
                        <option value="{{ $driver->id }}_{{ $driver->vehicle->id }}">{{ $driver->name }} - {{ $driver->vehicle->plate_number }}</option>
                    @endif
                @endforeach
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Status</label>
            <select name="status" class="form-control">
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Details</label>
            <input type="text" name="details" class="form-control">
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
            <h2>Edit Trip</h2>
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
            <label class="form-label">Booking</label>
            <select name="booking_id" class="form-control">
                <option value="">Select Booking</option>
                @foreach($bookings as $booking)
                    <option value="{{ $booking->id }}">#{{ $booking->id }} - {{ $booking->group_name }}</option>
                @endforeach
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Driver & Vehicle</label>
            <select name="driver_vehicle" class="form-control" id="edit_driver_vehicle">
                <option value="">Select Driver & Vehicle</option>
                @foreach($drivers as $driver)
                    @if($driver->vehicle)
                        <option value="{{ $driver->id }}_{{ $driver->vehicle->id }}">{{ $driver->name }} - {{ $driver->vehicle->plate_number }}</option>
                    @endif
                @endforeach
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Status</label>
            <select name="status" class="form-control">
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Details</label>
            <input type="text" name="details" class="form-control">
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
    document.querySelectorAll('[data-modal-target="editModal"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const record = JSON.parse(this.getAttribute('data-record'));
            if(record.driver_id && record.vehicle_id) {
                const dv = record.driver_id + '_' + record.vehicle_id;
                document.getElementById('edit_driver_vehicle').value = dv;
            } else {
                document.getElementById('edit_driver_vehicle').value = '';
            }
        });
    });

    document.querySelectorAll('.copy-msg-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const msg = this.getAttribute('data-msg');
            navigator.clipboard.writeText(msg).then(() => {
                alert('Message copied to clipboard!');
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                alert('Failed to copy message.');
            });
        });
    });

    // Download tip toast
    function showDownloadTip(event, url) {
        event.preventDefault();

        // Show toast
        const toast = document.createElement('div');
        toast.innerHTML = `
            <div style="position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#1e293b;color:#fff;padding:16px 24px;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.3);z-index:9999;font-size:14px;line-height:1.6;text-align:center;max-width:380px;animation:fadeInUp 0.3s ease;">
                <div style="font-size:20px;margin-bottom:6px;">📄 Saving as PDF</div>
                <div>When the print dialog opens:</div>
                <div style="margin-top:6px;background:#334155;padding:8px 12px;border-radius:8px;font-weight:bold;">
                    Set <span style="color:#4ade80;">Destination</span> → <span style="color:#4ade80;">Save as PDF</span>
                </div>
                <div style="margin-top:8px;font-size:12px;color:#94a3b8;">Opening document...</div>
            </div>
        `;
        document.body.appendChild(toast);

        // Open the voucher in new tab after short delay
        setTimeout(() => {
            window.open(url, '_blank');
            setTimeout(() => toast.remove(), 4000);
        }, 600);
    }
</script>
<style>
@keyframes fadeInUp {
    from { opacity: 0; transform: translateX(-50%) translateY(20px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}
</style>
@endpush