@extends('layouts.app')
@section('header_title', 'Dashboard')
@section('content')
<div style="margin-bottom: 24px;">
    <h1 style="margin: 0; font-size: 1.5rem; font-weight: 700;">Dashboard</h1>
    <p style="margin: 4px 0 0; color: var(--text-muted);">{{ now()->format('l, F j, Y') }}</p>
</div>

<div class="grid-cards" style="grid-template-columns: repeat(4, 1fr);">
    <!-- Row 1 -->
    <div class="stat-card" onclick="window.location.href='{{ route('trips.index', ['filter' => 'today']) }}'" style="justify-content: space-between; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
        <div class="stat-details">
            <h3 style="text-transform: uppercase; font-size: 0.75rem; font-weight: 600;">Today's Trips</h3>
            <p>{{ \App\Models\Trip::whereDate('date', today())->count() }}</p>
        </div>
        <div class="stat-icon" style="background: #eff6ff; color: #3b82f6;"><i class="fa-regular fa-calendar"></i></div>
    </div>
    
    <div class="stat-card" style="justify-content: space-between;">
        <div class="stat-details">
            <h3 style="text-transform: uppercase; font-size: 0.75rem; font-weight: 600;">Active Trips</h3>
            <p>{{ \App\Models\Trip::where('status', 'In Progress')->count() }}</p>
        </div>
        <div class="stat-icon" style="background: #f5f3ff; color: #8b5cf6;"><i class="fa-solid fa-bolt"></i></div>
    </div>
    
    <div class="stat-card" style="justify-content: space-between;">
        <div class="stat-details">
            <h3 style="text-transform: uppercase; font-size: 0.75rem; font-weight: 600;">Completed</h3>
            <p>{{ \App\Models\Trip::where('status', 'Completed')->count() }}</p>
        </div>
        <div class="stat-icon" style="background: #ecfdf5; color: #10b981;"><i class="fa-solid fa-check-double"></i></div>
    </div>

    <div class="stat-card" style="justify-content: space-between;">
        <div class="stat-details">
            <h3 style="text-transform: uppercase; font-size: 0.75rem; font-weight: 600;">Pending</h3>
            <p>{{ \App\Models\Trip::where('status', 'Scheduled')->count() }}</p>
        </div>
        <div class="stat-icon" style="background: #fff7ed; color: #f97316;"><i class="fa-solid fa-code-branch"></i></div>
    </div>

    <!-- Row 2 -->
    <div class="stat-card" style="justify-content: space-between;">
        <div class="stat-details">
            <h3 style="text-transform: uppercase; font-size: 0.75rem; font-weight: 600;">Monthly Income</h3>
            <p>SAR {{ number_format(\App\Models\Income::whereMonth('date', today()->month)->sum('amount')) }}</p>
        </div>
        <div class="stat-icon" style="background: #ecfdf5; color: #10b981;"><i class="fa-solid fa-arrow-trend-up"></i></div>
    </div>
    
    <div class="stat-card" style="justify-content: space-between;">
        <div class="stat-details">
            <h3 style="text-transform: uppercase; font-size: 0.75rem; font-weight: 600;">Monthly Expenses</h3>
            <p>SAR {{ number_format(\App\Models\Expense::whereMonth('date', today()->month)->sum('amount')) }}</p>
        </div>
        <div class="stat-icon" style="background: #fef2f2; color: #ef4444;"><i class="fa-solid fa-arrow-trend-down"></i></div>
    </div>
    
    @php
        $income = \App\Models\Income::whereMonth('date', today()->month)->sum('amount');
        $expense = \App\Models\Expense::whereMonth('date', today()->month)->sum('amount');
        $profit = $income - $expense;
    @endphp
    <div class="stat-card" style="justify-content: space-between;">
        <div class="stat-details">
            <h3 style="text-transform: uppercase; font-size: 0.75rem; font-weight: 600;">Profit</h3>
            <p>SAR {{ number_format($profit) }}</p>
        </div>
        <div class="stat-icon" style="background: #fef2f2; color: #ef4444;"><i class="fa-solid fa-dollar-sign"></i></div>
    </div>

    <div class="stat-card" style="justify-content: space-between;">
        <div class="stat-details">
            <h3 style="text-transform: uppercase; font-size: 0.75rem; font-weight: 600;">Cash Balance</h3>
            <p>SAR {{ number_format(\App\Models\Income::where('method', 'Cash')->sum('amount') - \App\Models\Expense::where('paid_by', 'Cash')->sum('amount')) }}</p>
        </div>
        <div class="stat-icon" style="background: #eff6ff; color: #3b82f6;"><i class="fa-solid fa-dollar-sign"></i></div>
    </div>
    
    <!-- Row 3 -->
    <div class="stat-card" style="justify-content: space-between;">
        <div class="stat-details">
            <h3 style="text-transform: uppercase; font-size: 0.75rem; font-weight: 600;">Bank Balance</h3>
            <p>SAR {{ number_format(\App\Models\Income::where('method', 'Bank Transfer')->sum('amount') - \App\Models\Expense::where('paid_by', 'Bank Transfer')->sum('amount')) }}</p>
        </div>
        <div class="stat-icon" style="background: #eff6ff; color: #3b82f6;"><i class="fa-solid fa-dollar-sign"></i></div>
    </div>
    
    <div class="stat-card" style="justify-content: space-between;">
        <div class="stat-details">
            <h3 style="text-transform: uppercase; font-size: 0.75rem; font-weight: 600;">Driver Payable</h3>
            <p>SAR {{ number_format(\App\Models\DriverPayment::where('type', 'Salary')->sum('amount')) }}</p>
        </div>
        <div class="stat-icon" style="background: #fff7ed; color: #f97316;"><i class="fa-solid fa-truck"></i></div>
    </div>
    
    <div class="stat-card" style="justify-content: space-between;">
        <div class="stat-details">
            <h3 style="text-transform: uppercase; font-size: 0.75rem; font-weight: 600;">Vendor Receivable</h3>
            <p>SAR {{ number_format(\App\Models\Booking::where('status', 'Confirmed')->sum('price') - \App\Models\Income::where('source', 'Booking Advance')->sum('amount')) }}</p>
        </div>
        <div class="stat-icon" style="background: #f5f3ff; color: #8b5cf6;"><i class="fa-solid fa-building"></i></div>
    </div>

    <div class="stat-card" style="justify-content: space-between;">
        <div class="stat-details">
            <h3 style="text-transform: uppercase; font-size: 0.75rem; font-weight: 600;">Active Drivers</h3>
            <p>{{ \App\Models\Driver::where('status', 'Available')->orWhere('status', 'On Trip')->count() }}</p>
            <span style="font-size: 0.7rem; color: var(--text-muted);">{{ \App\Models\Vehicle::count() }} vehicles</span>
        </div>
        <div class="stat-icon" style="background: #eff6ff; color: #3b82f6;"><i class="fa-solid fa-user-group"></i></div>
    </div>
</div>

@php
    $months = collect(range(5, 0))->map(function($i) {
        return now()->subMonths($i)->format('M');
    });

    $incomeData = collect(range(5, 0))->map(function($i) {
        return \App\Models\Income::whereYear('date', now()->subMonths($i)->year)
            ->whereMonth('date', now()->subMonths($i)->month)
            ->sum('amount');
    });

    $expenseData = collect(range(5, 0))->map(function($i) {
        return \App\Models\Expense::whereYear('date', now()->subMonths($i)->year)
            ->whereMonth('date', now()->subMonths($i)->month)
            ->sum('amount');
    });

    $completedTrips = \App\Models\Trip::where('status', 'Completed')->count();
    $inProgressTrips = \App\Models\Trip::where('status', 'In Progress')->count();
    $scheduledTrips = \App\Models\Trip::where('status', 'Scheduled')->count();
@endphp

<div class="chart-grid" style="margin-top: 24px;">
    <div class="card" style="margin-bottom: 0;">
        <div class="card-header" style="border-bottom: 1px solid var(--border); padding-bottom: 16px; margin-bottom: 16px;">
            <h2 class="card-title" style="font-size: 0.875rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Income vs Expenses (6 Months)</h2>
        </div>
        <div style="position: relative; height: 300px; width: 100%;">
            <canvas id="incomeExpenseChart"></canvas>
        </div>
    </div>
    
    <div class="card" style="margin-bottom: 0;">
        <div class="card-header" style="border-bottom: 1px solid var(--border); padding-bottom: 16px; margin-bottom: 16px;">
            <h2 class="card-title" style="font-size: 0.875rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Trip Status</h2>
        </div>
        <div style="position: relative; height: 300px; width: 100%;">
            <canvas id="tripStatusChart"></canvas>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
    document.addEventListener("DOMContentLoaded", function() {
        // Income vs Expense Chart
        const ctxLine = document.getElementById('incomeExpenseChart').getContext('2d');
        new Chart(ctxLine, {
            type: 'line',
            data: {
                labels: {!! json_encode($months) !!},
                datasets: [
                    {
                        label: 'Income',
                        data: {!! json_encode($incomeData) !!},
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Expenses',
                        data: {!! json_encode($expenseData) !!},
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });

        // Trip Status Doughnut Chart
        const ctxPie = document.getElementById('tripStatusChart').getContext('2d');
        new Chart(ctxPie, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'In Progress', 'Scheduled'],
                datasets: [{
                    data: [{{ $completedTrips }}, {{ $inProgressTrips }}, {{ $scheduledTrips }}],
                    backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' }
                },
                cutout: '75%'
            }
        });
    });
</script>
@endpush
