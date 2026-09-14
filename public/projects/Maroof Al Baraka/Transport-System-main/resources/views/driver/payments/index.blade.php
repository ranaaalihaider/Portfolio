@extends('layouts.driver')
@section('header', 'My Payments')
@section('content')
<div class="card">
    <div class="card-header">
        <h2 class="card-title">Payment History</h2>
    </div>
    <div class="table-responsive">
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Method</th>
                </tr>
            </thead>
            <tbody>
                @forelse($payments as $payment)
                <tr>
                    <td data-label="Date">{{ \Carbon\Carbon::parse($payment->date)->format('M d, Y') }}</td>
                    <td data-label="Type">{{ $payment->type }}</td>
                    <td data-label="Amount">${{ number_format($payment->amount, 2) }}</td>
                    <td data-label="Method">{{ $payment->method ?? 'N/A' }}</td>
                </tr>
                @empty
                <tr><td colspan="4" style="text-align:center; padding: 20px;">No payments found.</td></tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection
