@extends('layouts.auth')
@section('title', 'Sign Up')

@section('content')
<div class="auth-title">Create a new account</div>
<p class="text-center text-muted mb-4" style="color: var(--text-muted); font-size: 0.9rem; text-align: center; margin-bottom: 20px;">Please fill in the details to create your account.</p>

@if($errors->any())
    <div class="alert alert-danger">
        <ul style="margin:0; padding-left:20px;">
            @foreach($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

<form action="{{ route('register') }}" method="POST" id="signupForm">
    @csrf
    
    <div class="form-group" style="margin-bottom: 24px; text-align: center;">
        <label class="form-label" style="display: block; margin-bottom: 12px; font-weight: 600;">I am signing up as a:</label>
        <div class="role-selector" style="display: flex; justify-content: center; gap: 10px;">
            <input type="radio" style="display: none;" name="role" id="role_passenger" value="passenger" {{ old('role', 'passenger') === 'passenger' ? 'checked' : '' }}>
            <label class="role-btn" for="role_passenger">Passenger</label>

            <input type="radio" style="display: none;" name="role" id="role_driver" value="driver" {{ old('role') === 'driver' ? 'checked' : '' }}>
            <label class="role-btn" for="role_driver">Driver</label>
        </div>
    </div>

    <div class="form-row">
        <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" name="name" class="form-control" placeholder="Enter your full name" required value="{{ old('name') }}">
        </div>
        <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" name="email" class="form-control" placeholder="name@example.com" required value="{{ old('email') }}">
        </div>
    </div>
    
    <!-- Driver Specific Fields -->
    <div id="driver_fields" style="display: none;">
        <div class="form-row">
            <div class="form-group">
                <label class="form-label">License Number</label>
                <input type="text" name="license_number" id="license_number" class="form-control" placeholder="e.g. DL-123456" value="{{ old('license_number') }}">
            </div>
            <div class="form-group">
                <label class="form-label">Phone Number</label>
                <input type="text" name="driver_phone" id="driver_phone" class="form-control" placeholder="e.g. +966 50 123 4567" value="{{ old('phone') }}">
            </div>
        </div>
    </div>
    
    <!-- Passenger Specific Fields -->
    <div id="passenger_fields" style="display: none;">
        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Passport Number</label>
                <input type="text" name="passport" id="passport" class="form-control" placeholder="Enter your passport number" value="{{ old('passport') }}">
            </div>
            <div class="form-group">
                <label class="form-label">Nationality</label>
                <input type="text" name="nationality" id="nationality" class="form-control" placeholder="e.g. Indonesian" value="{{ old('nationality') }}">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Phone Number</label>
                <input type="text" name="passenger_phone" id="passenger_phone" class="form-control" placeholder="e.g. +966 50 123 4567" value="{{ old('phone') }}">
            </div>
            <div class="form-group">
                <!-- Empty flex placeholder to keep phone half-width -->
            </div>
        </div>
    </div>

    <div class="form-row">
        <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" name="password" class="form-control" placeholder="Create a password" required>
        </div>
        <div class="form-group">
            <label class="form-label">Confirm Password</label>
            <input type="password" name="password_confirmation" class="form-control" placeholder="Confirm your password" required>
        </div>
    </div>
    
    <!-- Hidden input to submit the correct phone field -->
    <input type="hidden" name="phone" id="real_phone" value="{{ old('phone') }}">

    <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 5px; padding: 10px; font-weight: 600; font-size: 1.05rem;">Sign Up</button>
</form>

<div class="auth-footer" style="margin-top: 20px; text-align: center;">
    Already have an account? <a href="{{ route('login') }}" style="font-weight: 600; text-decoration: none;">Log in</a>
</div>

<style>
    /* Adjust split screen ratio specifically for signup page */
    @media (min-width: 1024px) {
        .auth-image-side {
            flex: 3 !important;
        }
        .auth-form-side {
            flex: 7 !important;
        }
        .auth-card {
            max-width: 80% !important;
        }
    }

    .form-row {
        display: flex;
        gap: 15px;
    }
    .form-row .form-group {
        flex: 1;
        margin-bottom: 20px;
    }
    @media (max-width: 600px) {
        .form-row {
            flex-direction: column;
            gap: 0;
        }
    }

    /* Styling for the role selector to look modern */
    .role-selector input[type="radio"]:checked + .role-btn {
        background-color: var(--green-deep);
        color: var(--sand);
        border-color: var(--green-deep);
        box-shadow: 0 4px 6px -1px rgba(14, 42, 38, 0.3);
    }
    .role-btn {
        flex: 1;
        text-align: center;
        padding: 10px 0;
        border: 2px solid var(--line-on-light);
        color: var(--text-muted);
        font-weight: 600;
        transition: all 0.2s ease-in-out;
        cursor: pointer;
        border-radius: 6px;
        background-color: var(--sand-2);
    }
    .role-btn:hover {
        border-color: var(--gold);
        color: var(--green-deep);
    }
</style>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        const rolePassenger = document.getElementById('role_passenger');
        const roleDriver = document.getElementById('role_driver');
        const driverFields = document.getElementById('driver_fields');
        const passengerFields = document.getElementById('passenger_fields');
        const licenseInput = document.getElementById('license_number');
        const passportInput = document.getElementById('passport');
        const nationalityInput = document.getElementById('nationality');
        const driverPhoneInput = document.getElementById('driver_phone');
        const passengerPhoneInput = document.getElementById('passenger_phone');
        const realPhoneInput = document.getElementById('real_phone');
        const form = document.getElementById('signupForm');

        function toggleFields() {
            if (roleDriver.checked) {
                driverFields.style.display = 'block';
                passengerFields.style.display = 'none';
                
                // set required
                licenseInput.setAttribute('required', 'required');
                driverPhoneInput.setAttribute('required', 'required');
                
                passportInput.removeAttribute('required');
                nationalityInput.removeAttribute('required');
                passengerPhoneInput.removeAttribute('required');
            } else {
                driverFields.style.display = 'none';
                passengerFields.style.display = 'block';
                
                // set required
                licenseInput.removeAttribute('required');
                driverPhoneInput.removeAttribute('required');
                
                passportInput.setAttribute('required', 'required');
                nationalityInput.setAttribute('required', 'required');
                passengerPhoneInput.setAttribute('required', 'required');
            }
        }

        // Initialize on load
        toggleFields();

        // Listen for changes
        rolePassenger.addEventListener('change', toggleFields);
        roleDriver.addEventListener('change', toggleFields);
        
        // Before submit, ensure real_phone is populated
        form.addEventListener('submit', function() {
            if (roleDriver.checked) {
                realPhoneInput.value = driverPhoneInput.value;
            } else {
                realPhoneInput.value = passengerPhoneInput.value;
            }
        });
    });
</script>
@endsection
