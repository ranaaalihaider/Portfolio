<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckApproval
{
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check() && auth()->user()->role !== 'admin' && auth()->user()->approval_status !== 'approved') {
            auth()->logout();
            return redirect()->route('login')->withErrors(['email' => 'Your account is pending admin approval.']);
        }

        return $next($request);
    }
}
