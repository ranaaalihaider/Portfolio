@extends('layouts.app')

@section('header_title', 'Vouchers Hub')

@section('content')
<div class="card">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2 style="margin: 0; font-size: 1.25rem; color: var(--text-main); font-weight: 600;">All Vouchers</h2>
        <div>
            <!-- Custom Search Form -->
            <form action="{{ route('vouchers.index') }}" method="GET" style="display: flex; gap: 10px;">
                <input type="text" name="search" placeholder="Search Reference No or Driver..." value="{{ request('search') }}" style="padding: 8px 12px; border: 1px solid var(--border); border-radius: 6px; outline: none; width: 250px;">
                <button type="submit" class="btn btn-primary" style="padding: 8px 16px;">Search</button>
                @if(request('search'))
                    <a href="{{ route('vouchers.index') }}" class="btn btn-secondary" style="padding: 8px 16px; text-decoration: none;">Clear</a>
                @endif
            </form>
        </div>
    </div>

    <div class="table-responsive">
        <table class="table">
            <thead>
                <tr>
                    <th>Ref No</th>
                    <th>Trip Date</th>
                    <th>Route</th>
                    <th>Driver</th>
                    <th>Vehicle Plate</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @forelse($trips as $trip)
                <tr>
                    <td><strong>#DV-{{ str_pad($trip->id, 6, '0', STR_PAD_LEFT) }}</strong></td>
                    <td>{{ \Carbon\Carbon::parse($trip->date)->format('M d, Y') }}</td>
                    <td>
                        <span style="font-size: 0.85em; background: #e5e7eb; padding: 2px 6px; border-radius: 4px;">{{ $trip->booking->route->from_location ?? 'N/A' }}</span>
                        <i class="fa-solid fa-arrow-right" style="font-size: 0.75em; color: #9ca3af; margin: 0 4px;"></i>
                        <span style="font-size: 0.85em; background: #e5e7eb; padding: 2px 6px; border-radius: 4px;">{{ $trip->booking->route->to_location ?? 'N/A' }}</span>
                    </td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            @if($trip->driver && $trip->driver->picture)
                                <img src="{{ asset($trip->driver->picture) }}" alt="Pic" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover;">
                            @else
                                <div style="width: 24px; height: 24px; border-radius: 50%; background: #d1d5db; display: flex; align-items: center; justify-content: center;"><i class="fa-solid fa-user" style="font-size: 10px; color: #fff;"></i></div>
                            @endif
                            {{ $trip->driver->name ?? 'N/A' }}
                        </div>
                    </td>
                    <td>{{ $trip->vehicle->plate_number ?? 'N/A' }}</td>
                    <td>
                        <span class="badge {{ $trip->status === 'completed' ? 'badge-primary' : ($trip->status === 'cancelled' ? 'badge-danger' : 'badge-secondary') }}">
                            {{ ucfirst($trip->status) }}
                        </span>
                    </td>
                    <td>
                        <div style="display: flex; gap: 6px;">
                            <a href="{{ route('trips.voucher', $trip) }}" target="_blank" class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px; text-decoration: none;" title="View Voucher (Partner)">
                                <i class="fa-solid fa-eye"></i> View
                            </a>
                            <button onclick="printVoucher('{{ route('trips.voucher', $trip) }}')" class="btn btn-primary" style="padding: 4px 8px; font-size: 12px; border: none; cursor: pointer;" title="Print Voucher (Partner)">
                                <i class="fa-solid fa-print"></i> Print
                            </button>
                            <a href="{{ route('trips.voucher2', $trip) }}" target="_blank" class="btn btn-secondary" style="background: #ede9fe; color: #8b5cf6; border: 1px solid #8b5cf6; padding: 4px 8px; font-size: 12px; text-decoration: none;" title="View Voucher (My Company)">
                                <i class="fa-solid fa-eye"></i> View (My Co.)
                            </a>
                            <button onclick="printVoucher('{{ route('trips.voucher2', $trip) }}')" class="btn btn-primary" style="background: #8b5cf6; color: white; border: none; padding: 4px 8px; font-size: 12px; cursor: pointer;" title="Print Voucher (My Company)">
                                <i class="fa-solid fa-print"></i> Print (My Co.)
                            </button>
                        </div>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-light);">
                        <i class="fa-solid fa-file-invoice" style="font-size: 32px; color: #e5e7eb; margin-bottom: 10px; display: block;"></i>
                        No vouchers found.
                    </td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>

<script>
    function printVoucher(url) {
        // Open the voucher in a hidden iframe or new window and trigger print
        const printWindow = window.open(url, '_blank');
        printWindow.onload = function() {
            printWindow.print();
        };
    }
</script>
@endsection
