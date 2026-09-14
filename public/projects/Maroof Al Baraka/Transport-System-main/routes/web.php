<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\RouteController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\PassengerController;
use App\Http\Controllers\TripController;
use App\Http\Controllers\IncomeController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\DriverPaymentController;

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'showSignup'])->name('register');
    Route::post('/register', [AuthController::class, 'signup']);
});

Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::get('/home', function () {
    return redirect('/dashboard');
});

Route::get('/dashboard', function () {
    if (auth()->check()) {
        if (auth()->user()->role === 'admin') return redirect()->route('admin.dashboard');
        if (auth()->user()->role === 'driver') return redirect('/driver/dashboard');
        return redirect('/passenger/dashboard');
    }
    return redirect()->route('login');
})->name('dashboard');

Route::get('/', function () {
    $landingCars = \App\Models\LandingCar::orderBy('sort_order')->get();
    return view('landing', compact('landingCars'));
});

// Public Voucher Route
Route::get('trips/{trip}/voucher', [TripController::class, 'voucher'])->name('trips.voucher');
Route::get('trips/{trip}/download-pdf', [TripController::class, 'downloadPdf'])->name('trips.download-pdf');
Route::get('trips/{trip}/voucher2', [TripController::class, 'voucher2'])->name('trips.voucher2');
Route::get('trips/{trip}/download-pdf2', [TripController::class, 'downloadPdf2'])->name('trips.download-pdf2');

Route::middleware(['auth', 'approved', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', function () {
        return view('dashboard');
    })->name('admin.dashboard');

    Route::resource('drivers', DriverController::class);
    Route::resource('vehicles', VehicleController::class);
    Route::resource('vendors', VendorController::class);
    Route::resource('routes', RouteController::class);
    Route::resource('bookings', BookingController::class);
    Route::resource('passengers', PassengerController::class);
    Route::resource('trips', TripController::class);
    Route::get('vouchers', [\App\Http\Controllers\VoucherController::class, 'index'])->name('vouchers.index');
    Route::resource('incomes', IncomeController::class);
    Route::resource('expenses', ExpenseController::class);
    Route::resource('driver-payments', DriverPaymentController::class);
    Route::get('activity-logs', [\App\Http\Controllers\ActivityLogController::class, 'index'])->name('activity_logs.index');

    Route::get('/settings', [\App\Http\Controllers\Admin\SettingsController::class, 'index'])->name('admin.settings');
    Route::post('/settings', [\App\Http\Controllers\Admin\SettingsController::class, 'update'])->name('admin.settings.update');

    Route::resource('landing-cars', \App\Http\Controllers\Admin\LandingCarController::class)->except(['create', 'show', 'edit']);

    Route::get('/pending-approvals', [App\Http\Controllers\AdminUserController::class, 'pending'])->name('admin.users.pending');
    Route::post('/users/{user}/approve', [App\Http\Controllers\AdminUserController::class, 'approve'])->name('admin.users.approve');
    Route::post('/users/{user}/reject', [App\Http\Controllers\AdminUserController::class, 'reject'])->name('admin.users.reject');
});

// Routes for Driver portal
Route::middleware(['auth', 'approved', 'role:driver'])->prefix('driver')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Driver\DashboardController::class, 'index'])->name('driver.dashboard');
    Route::get('/trips', [\App\Http\Controllers\Driver\TripController::class, 'index'])->name('driver.trips.index');
    Route::post('/trips/{trip}/update', [\App\Http\Controllers\Driver\TripController::class, 'updateStatus'])->name('driver.trips.update');
    Route::get('/payments', [\App\Http\Controllers\Driver\PaymentController::class, 'index'])->name('driver.payments.index');
});

Route::middleware(['auth', 'approved', 'role:passenger'])->prefix('passenger')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Passenger\DashboardController::class, 'index'])->name('passenger.dashboard');
    Route::get('/bookings', [\App\Http\Controllers\Passenger\BookingController::class, 'index'])->name('passenger.bookings.index');
});
