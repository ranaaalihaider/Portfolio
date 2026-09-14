<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>Voucher #DV-{{ str_pad($trip->id, 6, '0', STR_PAD_LEFT) }}</title>
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body {
            font-family: 'Tajawal', sans-serif;
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
            padding: 10mm;
            box-sizing: border-box;
            position: relative;
        }

        /* Standard Header */
        .header {
            display: flex;
            width: 100%;
            border-top: 1px solid #d1d5db;
            border-bottom: 1px solid #d1d5db;
            margin-bottom: 15px;
        }

        .header-col {
            flex: 1;
            padding: 10px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            font-size: 13px;
            line-height: 1.6;
        }

        .header-right { text-align: right; font-weight: bold; border-left: 1px solid #d1d5db; }
        .header-center { text-align: center; border-left: 1px solid #d1d5db; align-items: center; }
        .header-left { text-align: left; }

        .company-logo-text { font-size: 24px; font-weight: 800; color: #1e3a8a; }

        .page-title {
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            padding: 5px 0;
            border-top: 2px solid #e5e7eb;
            border-bottom: 2px solid #e5e7eb;
            margin-bottom: 10px;
        }

        /* Grid Layout */
        .grid-container {
            display: flex;
            gap: 15px;
            margin-bottom: 10px;
        }

        .left-col { flex: 2; }
        .right-col { flex: 1; border: 1px solid #d1d5db; }

        /* Tables */
        .info-table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #d1d5db;
            margin-bottom: 10px;
            text-align: center;
        }

        .info-table th { background-color: #d1d5db; font-weight: bold; padding: 4px; font-size: 13px; border: 1px solid #fff; }
        .info-table td { padding: 4px; font-size: 12px; border: 1px solid #d1d5db; background: #fff; }
        
        /* Driver Col Specific */
        .driver-header { background-color: #d1d5db; font-weight: bold; padding: 4px; text-align: center; font-size: 13px; border-bottom: 1px solid #fff; }
        .driver-img-box { padding: 5px; text-align: center; border-bottom: 1px solid #d1d5db; background: #fff; height: 100px; display: flex; align-items: center; justify-content: center;}
        .driver-img-box img { max-width: 90px; max-height: 90px; object-fit: cover; }
        .driver-row-label { background-color: #d1d5db; font-weight: bold; padding: 3px; text-align: center; font-size: 12px; border-bottom: 1px solid #fff; }
        .driver-row-value { padding: 3px; text-align: center; font-size: 12px; border-bottom: 1px solid #d1d5db; background: #fff; }
        
        .driver-row-value:last-child { border-bottom: none; }

        /* Contract Text */
        .contract-section {
            border-top: 3px solid #000;
            padding-top: 10px;
            font-size: 11px;
            line-height: 1.5;
            text-align: justify;
        }

        .contract-section p { margin: 0 0 5px 0; }

        /* Footer */
        .footer {
            position: absolute;
            bottom: 10mm;
            left: 10mm;
            right: 10mm;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 3px solid #000;
            padding-top: 10px;
        }

        .footer-stamp-img {
            width: 100px;
            height: 100px;
            object-fit: contain;
        }

        .footer-contact {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 16px;
            font-weight: bold;
            color: #000;
        }

        .footer-qr { width: 100px; height: 100px; }
        .page-num { position: absolute; bottom: 5mm; left: 0; right: 0; text-align: center; font-size: 12px; }

        /* Inspection Tables */
        .inspection-title { font-weight: bold; font-size: 12px; margin: 2px 0 0 0; }
        .inspection-table { width: 100%; border-collapse: collapse; border: 2px solid #000; text-align: center; font-size: 11px; }
        .inspection-table th, .inspection-table td { border: 2px solid #000; padding: 1px; }
        
        /* Print Settings */
        @media print {
            body { background: white; padding: 0; margin: 0; min-width: 210mm !important; }
            html { min-width: 210mm !important; }
            .page { 
                width: 210mm !important;
                min-width: 210mm !important;
                box-shadow: none; 
                margin: 0 auto !important; 
                padding: 10mm 10mm 50mm 10mm !important; /* Huge bottom padding to avoid footer overlap */
                page-break-before: always !important; 
                page-break-after: auto !important;
                page-break-inside: avoid !important;
                height: 100vh !important;
                max-height: 100vh !important;
                min-height: auto !important;
                overflow: hidden !important;
            }
            .page:first-of-type { page-break-before: auto !important; }
            html, body { height: auto; overflow: visible; }
            @page { margin: 0; size: A4 portrait; }
        }
    </style>
</head>
<body>

@php
    function getBase64Image($path, $isExternal = false) {
        if (!$path) return '';
        try {
            if ($isExternal) {
                // Fetch external QR code
                $data = file_get_contents($path);
                return 'data:image/png;base64,' . base64_encode($data);
            } else {
                $fullPath = public_path($path);
                if (file_exists($fullPath)) {
                    $type = pathinfo($fullPath, PATHINFO_EXTENSION);
                    $data = file_get_contents($fullPath);
                    return 'data:image/' . $type . ';base64,' . base64_encode($data);
                }
            }
        } catch (\Exception $e) {}
        return $isExternal ? $path : asset($path);
    }

    $leader = $trip->booking->passengers->where('is_leader', true)->first() ?? $trip->booking->passengers->first();
    $qrUrl = route('trips.voucher', $trip->id);
    $qrApiUrl = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" . urlencode($qrUrl);
    $qrSrc = getBase64Image($qrApiUrl, true);
    $whatsapp = $settings['whatsapp_number'] ?? '0552554803';
    
    // Handle Logo Logic
    $logoHtml = '';
    if (isset($settings["app_logo"]) && $settings["app_logo"]) {
        $logoHtml = '<img src="'.getBase64Image($settings["app_logo"]).'" style="max-height: 60px;">';
    } else {
        $logoHtml = '<img src="'.getBase64Image("new-stamp.jpeg").'" style="max-height: 80px;">';
    }

    // Header partial to reuse
    $headerHtml = '
    <div class="header">
        <div class="header-col header-right">
            شركة معروف البركة المحدودة<br>
            رقم السجل التجاري: '.($settings["cr_number"] ?? "4031283847").'<br>
            مكة المكرمة
        </div>
        <div class="header-col header-center">
            ' . $logoHtml . '
            <div style="font-weight:bold; font-size: 13px; margin-top: 5px;">شركة معروف البركة المحدودة</div>
        </div>
        <div class="header-col header-left">
            نوع التشغيل: نقل بين المدن<br>
            رقم المرجع: '.$trip->id.'<br>
            تاريخ الإصدار : '.\Carbon\Carbon::parse($trip->created_at)->format('d/m/Y').'
        </div>
    </div>';

    // Footer partial to reuse
    $footerHtml = function($pageNum) use ($settings, $whatsapp, $qrSrc) {
        return '
        <div class="footer">
            <img src="'.getBase64Image('new-stamp.jpeg').'" class="footer-stamp-img" alt="Stamp">
            <div class="footer-contact" style="display: flex; align-items: center; justify-content: center; gap: 8px; direction: ltr;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="width: 24px; height: 24px; fill: #22c55e; flex-shrink: 0;"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157.1zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
                <span style="font-size: 16px; font-weight: bold; padding-top: 4px;">'.$whatsapp.'</span>
            </div>
            <img src="'.$qrSrc.'" class="footer-qr" alt="QR Code">
        </div>
        <div class="page-num">'.$pageNum.' / 3</div>';
    };
@endphp

<!-- PAGE 1: CONTRACT -->
<div class="page">
    {!! $headerHtml !!}
    <div class="page-title" style="border:none;">إبرام عقد بين الطرفين</div>

    <div class="grid-container">
        <!-- Left Col: Trip & Passenger -->
        <div class="left-col">
            <div class="driver-header">معلومات الرحلة</div>
            <table class="info-table" style="margin-bottom: 20px;">
                <tr>
                    <th style="background:#e5e7eb;">من</th>
                    <th style="background:#e5e7eb;">الى</th>
                    <th style="background:#e5e7eb;">تاريخ و وقت المغادرة</th>
                </tr>
                <tr>
                    <td>{{ $trip->booking->route->from_location ?? 'N/A' }}</td>
                    <td>{{ $trip->booking->route->to_location ?? 'N/A' }}</td>
                    <td style="direction: ltr;">
                        {{ \Carbon\Carbon::parse($trip->date)->format('Y-m-d') }}<br><br>
                        {{ $trip->time ? \Carbon\Carbon::parse($trip->time)->format('H : i') : '00 : 00' }}
                    </td>
                </tr>
            </table>

            <div class="driver-header">معلومات الركاب</div>
            <table class="info-table">
                <tr>
                    <th style="background:#e5e7eb;">إسم الضيف الأساسي</th>
                    <th style="background:#e5e7eb;">رقم الجوال</th>
                    <th style="background:#e5e7eb;">عدد الركاب</th>
                </tr>
                <tr>
                    <td>{{ $leader->name ?? 'N/A' }}</td>
                    <td style="direction: ltr;">{{ $trip->booking->contact ?? 'N/A' }}</td>
                    <td>{{ $trip->booking->pax_count ?? 0 }}</td>
                </tr>
            </table>
        </div>

        <!-- Right Col: Driver -->
        <div class="right-col">
            <div class="driver-header">معلومات السائق</div>
            <div class="driver-img-box">
                @if($trip->driver && $trip->driver->picture)
                    <img src="{{ getBase64Image($trip->driver->picture) }}" alt="Driver">
                @else
                    <i class="fa-solid fa-user" style="font-size: 60px; color: #d1d5db;"></i>
                @endif
            </div>
            <div class="driver-row-label">السائق الأساسي</div>
            <div class="driver-row-value">{{ $trip->driver->name ?? 'N/A' }}</div>
            
            <div class="driver-row-label">رقم الهوية</div>
            <div class="driver-row-value">{{ $trip->driver->iqama_number ?? 'N/A' }}</div>
            
            <div class="driver-row-label">رقم الجوال</div>
            <div class="driver-row-value" style="direction: ltr;">{{ $trip->driver->phone ?? 'N/A' }}</div>
            
            <div class="driver-row-label">رقم اللوحة</div>
            <div class="driver-row-value">{{ $trip->vehicle->plate_number ?? 'N/A' }}</div>
        </div>
    </div>

    <div class="contract-section">
        <p>تم إبرام هذا العقد بين المتعاقدين بناءً على المادة (39) التاسعة والثلاثين من اللائحة المنظمة لنشاط النقل المتخصص وتأجير وتوجيه الحافلات، وبناءً على الفقرة (1) من المادة (39) التي تنص على أنه يجب على الناقل إبرام عقد نقل مع الأطراف المحددين في المادة (40) قبل تنفيذ عمليات النقل على الطرق الريفية، وبما لا يخالف أحكام هذه اللائحة ووفقاً للضوابط التي تحددها هيئة النقل.</p>
        <p>وبناءً على ما سبق، تم إبرام عقد النقل بين الأطراف الآتية:</p>
        <p style="text-align: center; margin: 15px 0;">
            <u>الطرف الأول-: شركة معروف البركة المحدودة رقم السجل التجاري: {{ $settings['cr_number'] ?? '4031283847' }}</u> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <u>الطرف الثاني: {{ $leader->name ?? 'N/A' }}</u>
        </p>
        <p>- اتفق الطرفان على أن ينفذ الطرف الأول عملية النقل للطرف الثاني مع مرافقيه وذويهم من الموقع المحدد مسبقاً مع الطرف الثاني وتوصيلهم إلى الوجهة المحددة في العقد.</p>
        <p>- في حال إلغاء التعاقد لأي سبب شخصي أو أسباب أخرى تتعلق في الحجوزات أو الأنظمة تكون سياسة الإلغاء والاستبدال حسب نظام وزارة التجارة السعودية. في حالة الحجز وتم الإلغاء قبل موعد الرحلة بأكثر من 24 ساعة يتم استرداد المبلغ كامل.</p>
        <p>- في حال طلب الطرف الثاني الحجز من خلال الموقع الإلكتروني للمؤسسة، يعتبر هذا الحجز وموافقته على الشروط والأحكام بالموقع الإلكتروني هو موافقة على هذا العقد لتنفيذ عملية النقل المتفق عليها مع الطرف الأول بواسطة حافلات المؤسسة المرخصة والمتوافقة مع الاشتراطات المقررة من هيئة النقل.</p>
    </div>

    {!! $footerHtml(1) !!}
</div>

<!-- PAGE 2: PASSENGER LIST -->
<div class="page">
    {!! $headerHtml !!}
    <div class="page-title" style="border:none;">كشف ركاب</div>

    <div class="driver-header">معلومات الركاب</div>
    <table class="info-table" style="margin-bottom: 0;">
        <tr>
            <th style="background:#e5e7eb; width: 50px;">م</th>
            <th style="background:#e5e7eb;">إسم الضيف</th>
            <th style="background:#e5e7eb;">الجنسية</th>
            <th style="background:#e5e7eb;">رقم الهوية / الجواز</th>
        </tr>
        @foreach($trip->booking->passengers as $index => $passenger)
        <tr>
            <td>{{ $index + 1 }}.</td>
            <td>{{ $passenger->name }}</td>
            <td>{{ $passenger->nationality ?? 'المملكة المتحدة' }}</td>
            <td>{{ $passenger->iqama_number ?? 'N/A' }}</td>
        </tr>
        @endforeach
    </table>

    {!! $footerHtml(2) !!}
</div>

<!-- PAGE 3: VEHICLE INSPECTION -->
<div class="page">
    {!! $headerHtml !!}
    <div class="page-title" style="border:none; margin-bottom: 2px; padding-bottom: 0; font-size: 20px;">سجل الفحص اليومي للسيارة</div>

    <div style="display: flex; justify-content: center; gap: 40px; margin-bottom: 5px; font-size: 13px;">
        <div style="text-align: right;">
            <p style="margin: 2px 0;">اسم الشركة &nbsp;&nbsp; شركة معروف البركة المحدودة</p>
            <p style="margin: 2px 0;">لوحة المركبة &nbsp;&nbsp; <span style="direction: ltr; display: inline-block;">{{ $trip->vehicle->plate_number ?? 'N/A' }}</span></p>
        </div>
        <div style="text-align: right;">
            <p style="margin: 2px 0;">رقم الحافلة &nbsp;&nbsp; <span style="direction: ltr; display: inline-block;">{{ $trip->vehicle->id ?? 'N/A' }}</span></p>
            <p style="margin: 2px 0;">تاريخ الفحص &nbsp;&nbsp; <span style="direction: ltr; display: inline-block;">{{ \Carbon\Carbon::parse($trip->date)->format('Y-m-d') }}</span></p>
        </div>
    </div>

    <div class="inspection-title">أولاً: فحص مؤشرات لوحة القيادة</div>
    <table class="inspection-table">
        <tr>
            <th style="width: 40%;">البند</th>
            <th style="width: 15%;">سليم</th>
            <th style="width: 15%;">غير سليم</th>
            <th style="width: 30%;">ملاحظات</th>
        </tr>
        <tr><td>مؤشر الوقود</td><td>✔</td><td></td><td></td></tr>
        <tr><td>مؤشر الحرارة</td><td>✔</td><td></td><td></td></tr>
        <tr><td>مؤشر ضغط الزيت</td><td>✔</td><td></td><td></td></tr>
        <tr><td>لمبة فحص المحرك</td><td>✔</td><td></td><td></td></tr>
        <tr><td>ABS</td><td>✔</td><td></td><td></td></tr>
        <tr><td>لمبات التحذير</td><td>✔</td><td></td><td></td></tr>
    </table>

    <div class="inspection-title">ثانياً: الفحص الخارجي</div>
    <table class="inspection-table">
        <tr>
            <th style="width: 40%;">البند</th>
            <th style="width: 15%;">سليم</th>
            <th style="width: 15%;">غير سليم</th>
            <th style="width: 30%;">ملاحظات</th>
        </tr>
        <tr><td>الإطارات وضغط الهواء</td><td>✔</td><td></td><td></td></tr>
        <tr><td>الأنوار الأمامية و الخلفية</td><td>✔</td><td></td><td></td></tr>
        <tr><td>الإشارات التحذيرية</td><td>✔</td><td></td><td></td></tr>
        <tr><td>الزجاج والمرايا</td><td>✔</td><td></td><td></td></tr>
        <tr><td>عدم وجود تسريبات</td><td>✔</td><td></td><td></td></tr>
    </table>

    <div class="inspection-title">ثالثاً: أدوات ومتطلبات الأمن والسلامة</div>
    <table class="inspection-table">
        <tr>
            <th style="width: 40%;">البند</th>
            <th style="width: 15%;">سليم</th>
            <th style="width: 15%;">غير سليم</th>
            <th style="width: 30%;">ملاحظات</th>
        </tr>
        <tr><td>طفاية حريق</td><td>✔</td><td></td><td></td></tr>
        <tr><td>مثلث تحذيري</td><td>✔</td><td></td><td></td></tr>
        <tr><td>حقيبة اسعافات أولية</td><td>✔</td><td></td><td></td></tr>
        <tr><td>مطرقة كسر الزجاج</td><td>✔</td><td></td><td></td></tr>
        <tr><td>أحزمة الأمان</td><td>✔</td><td></td><td></td></tr>
    </table>

    <div style="margin-top: 5px; text-align: center;">
        <h2 style="text-align: center; margin: 10px 0 5px 0;">إقرار</h2>
        <p style="text-align: center; font-size: 14px; margin-bottom: 5px;">أقر انا السائق أعلاه بأنني قمت بفحص الحافلة و التأكد من سلامتها وجاهزيتها قبل التشغيل.</p>
        <p style="text-align: center; font-weight: bold; font-size: 14px; margin-top: 5px;">اسم السائق: {{ $trip->driver->user->name ?? 'N/A' }}</p>
    </div>

    {!! $footerHtml(3) !!}
</div>

<script>
    window.onload = function() {
        window.print();
    }
</script>
</body>
</html>
