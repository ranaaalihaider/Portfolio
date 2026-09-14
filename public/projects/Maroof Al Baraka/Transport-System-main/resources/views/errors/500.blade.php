<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>System Error</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            background-color: #0E2A26;
            color: #fff;
            font-family: 'Inter', sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            text-align: center;
        }
        .container {
            max-width: 600px;
            padding: 40px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(212, 175, 55, 0.2);
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }
        h1 {
            color: #D4AF37;
            font-size: 80px;
            margin: 0 0 20px;
            line-height: 1;
        }
        h2 {
            font-size: 24px;
            margin-bottom: 15px;
        }
        p {
            color: #9ca3af;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        .error-details {
            background: rgba(0,0,0,0.3);
            padding: 15px;
            border-radius: 6px;
            color: #ef4444;
            font-size: 13px;
            text-align: left;
            word-wrap: break-word;
            margin-bottom: 30px;
        }
        .btn {
            display: inline-block;
            background: #D4AF37;
            color: #0E2A26;
            text-decoration: none;
            padding: 12px 30px;
            font-weight: 600;
            border-radius: 6px;
            transition: all 0.3s;
        }
        .btn:hover {
            background: #e0bd6e;
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Oops!</h1>
        <h2>Something went wrong</h2>
        <p>We encountered an unexpected system error while trying to process your request. Our system administrators have been notified.</p>
        
        @if(app()->hasDebugModeEnabled())
            <div class="error-details">
                <strong>Debug Info:</strong><br>
                {{ $error ?? 'Unknown exception occurred.' }}
            </div>
        @endif

        <a href="{{ url()->previous() !== url()->current() ? url()->previous() : url('/') }}" class="btn">Go Back Safely</a>
    </div>
</body>
</html>
