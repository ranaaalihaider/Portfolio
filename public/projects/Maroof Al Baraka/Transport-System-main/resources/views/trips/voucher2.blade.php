<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Driver Voucher #DV-{{ str_pad($trip->id, 6, '0', STR_PAD_LEFT) }}</title>
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@000;500;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #525659;
            margin: 0;
            padding: 20px 0;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .page {
            width: 210mm;
            min-height: 297mm;
            background: white;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            margin-bottom: 20px;
            padding: 15mm;
            box-sizing: border-box;
            position: relative;
            color: #333;
        }

        .top-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #ccc;
            padding-bottom: 10px;
            margin-bottom: 20px;
            font-size: 14px;
        }

        .urdu-text {
            font-family: 'Tajawal', 'Nafees', sans-serif;
            font-size: 18px;
            text-align: right;
            direction: rtl;
        }

        .title-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 20px;
        }

        .voucher-title {
            font-size: 14px;
            color: #666;
            margin: 0;
            text-transform: uppercase;
        }

        .voucher-number {
            font-size: 32px;
            font-weight: bold;
            color: #111;
            margin: 0;
        }

        .customer-box {
            background-color: #f0f0f0;
            padding: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 15px;
            margin-bottom: 20px;
            border-radius: 4px;
            border-left: 4px solid #555;
        }

        .customer-box strong { color: #222; }

        .section-header {
            font-size: 13px;
            font-weight: bold;
            margin-bottom: 8px;
            text-transform: uppercase;
            color: #333;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
            font-size: 14px;
        }

        th, td {
            border: 1px solid #ccc;
            padding: 10px;
            text-align: left;
        }

        .trip-details td:first-child {
            background-color: #f9f9f9;
            width: 30%;
            font-weight: bold;
            color: #555;
        }

        .flight-details th {
            background-color: #f0f0f0;
            font-weight: bold;
            color: #555;
        }

        .driver-assignment {
            border: 2px dashed #999;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 6px;
        }
        
        .driver-assignment .header {
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 25px;
            color: #444;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
        }

        .dotted-line {
            border-bottom: 1px dashed #666;
            flex-grow: 1;
            margin: 0 10px;
        }

        .flex-row {
            display: flex;
            align-items: flex-end;
            margin-bottom: 10px;
        }

        .footer-date {
            text-align: center;
            font-size: 12px;
            color: #777;
            margin-top: 30px;
        }

        @media print {
            body { background: white; padding: 0; margin: 0; min-width: 210mm !important; }
            .page { 
                box-shadow: none; 
                margin: 0; 
                padding: 10mm;
                page-break-after: avoid;
            }
        }
    </style>
</head>
<body>

@php
    $leader = $trip->booking->passengers->where('is_leader', true)->first() ?? $trip->booking->passengers->first();
    $contact = $trip->booking->contact ?? 'N/A';
    $customerName = $leader->name ?? ($trip->booking->group_name ?? 'N/A');
    $customerIqama = $leader->iqama_number ?? '';
    
    $fromLoc = $trip->booking->route->from_location ?? 'N/A';
    $toLoc = $trip->booking->route->to_location ?? 'N/A';
    $vehicleModel = $trip->vehicle->model ?? 'N/A';
    $pax = $trip->booking->pax_count ?? 0;
    
    $date = \Carbon\Carbon::parse($trip->date)->format('d-M-Y');
    $time = $trip->booking && $trip->booking->pickup_time ? \Carbon\Carbon::parse($trip->booking->pickup_time)->format('h:i A') : 'N/A';
@endphp

<div class="page">
    <!-- Top Header -->
    <div class="top-header">
        <div style="margin-top: 20px;">
            Driver Job: {{ $fromLoc }} to {{ $toLoc }}
        </div>
        <div style="text-align: right;">
            <div style="color: #666; margin-bottom: 10px; margin-top: -15px;">Driver Voucher - #DV-{{ $trip->id }}</div>
            <div class="urdu-text">нیکیج تفеیل: {{ $fromLoc }} سے  {{ $toLoc }}</div>
        </div>
    </div>

    <!-- Title Row -->
    <div class="title-row">
        <div>
            <p class="voucher-title">DRIVER VOUCHER</p>
            <p class="voucher-number">#DV-{{ str_pad($trip->id, 6, '0', STR_PAD_LEFT) }}</p>
        </div>
        <div style="font-size: 15px; font-weight: bold;">
            Date: {{ now()->format('d M, Y') }}
        </div>
    </div>


    <!-- Customer Box -->
    <div class="customer-box">
        <div>
            <i class="fa-solid fa-user" style="color: #555; margin-right: 8px;"></i>
            CUSTOMER: <strong>{{ strtoupper($customerName) }} @if($customerIqama) ({{ $customerIqama }}) @endif</strong>
        </div>
        <div>
            <i class="fa-solid fa-phone" style="color: #555; margin-right: 8px;"></i>
            CONTACT: <strong>{{ $contact }}</strong>
        </div>
    </div>

    <!-- Trip Details -->
    <div class="section-header">
        <i class="fa-solid fa-map-location-dot" style="margin-right: 6px;"></i> TRIP DETAILS
    </div>
    <table class="trip-details">
        <tr>
            <td>Pickup Location</td>
            <td>{{ $fromLoc }}</td>
        </tr>
        <tr>
            <td>Pickup Date & Time</td>
            <td>{{ $date }} at {{ $time }}</td>
        </tr>
        <tr>
            <td>Dropoff Location</td>
            <td>{{ $toLoc }}</td>
        </tr>
        <tr>
            <td>Vehicle</td>
            <td>{{ $vehicleModel }}</td>
        </tr>
        <tr>
            <td>Capacity</td>
            <td>{{ $pax }} Adults</td>
        </tr>
    </table>

    <!-- Flight Details -->
    <div class="section-header">
        <i class="fa-solid fa-plane" style="margin-right: 6px;"></i> FLIGHT DETAILS (FOR REFERENCE)
    </div>
    <table class="flight-details">
        <tr>
            <th>Date</th>
            <th>Flight #</th>
            <th>Route Detail</th>
            <th>Time</th>
        </tr>
        <tr>
            <td>
                <strong>{{ \Carbon\Carbon::parse($trip->date)->format('d M') }}</strong><br>
                <span style="font-size:12px; color:#666;">(Pickup Day)</span>
            </td>
            <td></td>
            <td>ARR: {{ $fromLoc }}</td>
            <td>A: {{ $time }}</td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td>DEP: </td>
            <td>D: </td>
        </tr>
    </table>

    <!-- Driver Assignment 1 -->
    <div class="driver-assignment">
        <div class="header">
            <i class="fa-solid fa-id-card" style="margin-right: 6px;"></i> DRIVER ASSIGNMENT (HANDWRITTEN) (SECTION 1)
        </div>
        <div class="flex-row">
            <div style="font-size: 13px; font-weight: bold;">DRIVER:</div>
            <div class="dotted-line"></div>
            <div style="font-size: 13px; font-weight: bold; margin-left: 20px;">MOBILE:</div>
            <div class="dotted-line"></div>
        </div>
    </div>


    <!-- Driver Assignment 2 -->
    <div class="driver-assignment" style="margin-top: 20px;">
        <div class="header">
            <i class="fa-solid fa-id-card" style="margin-right: 6px;"></i> DRIVER ASSIGNMENT (HANDWRITTEN) (SECTION 2)
        </div>
        <div class="flex-row">
            <div style="font-size: 13px; font-weight: bold;">DRIVER:</div>
            <div class="dotted-line"></div>
            <div style="font-size: 13px; font-weight: bold; margin-left: 20px;">MOBILE:</div>
            <div class="dotted-line"></div>
        </div>
    </div>

    <div class="footer-date">
        Generated on {{ now()->format('Y-m-d H:i:s') }}
    </div>

</div>

<script>
    window.onload = function() {
        window.print();
    }
</script>
</body>
</html>
