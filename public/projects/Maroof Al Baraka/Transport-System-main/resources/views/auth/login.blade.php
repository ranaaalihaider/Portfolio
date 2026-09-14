@extends('layouts.auth')
@section('title', 'Login')

@section('content')
<div class="auth-title">Sign in to your account</div>
<p class="text-center text-muted mb-4" style="color: var(--text-muted); font-size: 0.9rem; text-align: center; margin-bottom: 24px;">Welcome back! Please enter your details.</p>

@if(session('success'))
    <div class="alert alert-success">{{ session('success') }}</div>
@endif

@if($errors->any())
    <div class="alert alert-danger">
        {{ $errors->first() }}
    </div>
@endif

<form action="{{ route('login') }}" method="POST">
    @csrf
    <div class="form-group">
        <label class="form-label">Email Address</label>
        <input type="email" name="email" class="form-control" placeholder="Enter your email" required autofocus value="{{ old('email') }}">
    </div>
    
    <div class="form-group">
        <label class="form-label" style="display: flex; justify-content: space-between; align-items: center;">
            Password
            <a href="#" onclick="showAdminModal(); return false;" style="font-size: 0.85rem; color: var(--primary); text-decoration: none; font-weight: 500;">Forgot password?</a>
        </label>
        <input type="password" name="password" class="form-control" placeholder="Enter your password" required>
    </div>
    
    <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 15px; padding: 10px; font-weight: 600; font-size: 1.05rem;">Sign In</button>
</form>

<div class="auth-footer" style="margin-top: 25px; text-align: center;">
    Don't have an account? <a href="{{ route('register') }}" style="font-weight: 600; text-decoration: none;">Sign up</a>
</div>

<!-- Admin Contact Modal -->
<div id="adminContactModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); backdrop-filter: blur(5px); z-index: 9999; justify-content: center; align-items: center; opacity: 0; transition: opacity 0.3s ease;">
    <div style="background: white; border-radius: 16px; padding: 32px; max-width: 400px; width: 90%; box-shadow: 0 20px 40px rgba(0,0,0,0.15); transform: translateY(20px); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); text-align: center; position: relative;">
        <button type="button" onclick="hideAdminModal()" style="position: absolute; top: 16px; right: 16px; background: none; border: none; font-size: 1.5rem; color: #adb5bd; cursor: pointer; padding: 0; line-height: 1;">&times;</button>
        <div style="width: 64px; height: 64px; background: #f0f5ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary, #4361ee)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
        </div>
        <h3 style="margin-top: 0; margin-bottom: 12px; color: #2b2b2b; font-size: 1.4rem; font-weight: 700;">Contact Administrator</h3>
        <p style="color: var(--text-muted, #6c757d); font-size: 1rem; line-height: 1.6; margin-bottom: 30px;">
            For security reasons, password resets must be securely handled by your system administrator. Please reach out to them directly.
        </p>
        <button type="button" onclick="hideAdminModal()" style="background: var(--primary, #4361ee); color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 1.05rem; cursor: pointer; width: 100%; transition: opacity 0.2s; box-shadow: 0 4px 10px rgba(67, 97, 238, 0.3);">
            Understood
        </button>
    </div>
</div>

<script>
    function showAdminModal() {
        const modal = document.getElementById('adminContactModal');
        const modalBox = modal.querySelector('div');
        modal.style.display = 'flex';
        // Trigger reflow
        void modal.offsetWidth;
        modal.style.opacity = '1';
        modalBox.style.transform = 'translateY(0)';
    }

    function hideAdminModal() {
        const modal = document.getElementById('adminContactModal');
        const modalBox = modal.querySelector('div');
        modal.style.opacity = '0';
        modalBox.style.transform = 'translateY(20px)';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
</script>
@endsection
