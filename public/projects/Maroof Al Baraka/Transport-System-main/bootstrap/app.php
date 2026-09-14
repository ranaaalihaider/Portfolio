<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'role' => \App\Http\Middleware\CheckRole::class,
            'approved' => \App\Http\Middleware\CheckApproval::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (\Throwable $e, \Illuminate\Http\Request $request) {
            // Ignore validation, auth, and HTTP exceptions (404, 403, etc) as Laravel handles them well
            if ($e instanceof \Illuminate\Validation\ValidationException || 
                $e instanceof \Illuminate\Auth\AuthenticationException ||
                $e instanceof \Illuminate\Session\TokenMismatchException ||
                $e instanceof \Symfony\Component\HttpKernel\Exception\HttpException) {
                return null;
            }

            // For AJAX/API requests
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'System Error: ' . $e->getMessage()
                ], 500);
            }

            // For form submissions (POST, PUT, DELETE), redirect back with a flash error popup instead of crashing
            if (in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE'])) {
                return redirect()->back()->withInput()->with('error', 'Operation Failed: ' . $e->getMessage());
            }

            // For page loads (GET), render a beautiful fallback 500 page instead of redirecting (which causes infinite loops)
            return response()->view('errors.500', ['error' => $e->getMessage()], 500);
        });
    })->create();
