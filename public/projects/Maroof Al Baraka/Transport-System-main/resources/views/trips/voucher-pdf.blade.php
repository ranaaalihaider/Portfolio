<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>Voucher #{{ $trip->id }}</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'DejaVu Sans', sans-serif;
            direction: rtl;
            background: #fff;
            font-size: 11px;
            color: #000;
        }
        .page {
            width: 100%;
            padding: 10mm 10mm 20mm 10mm;
            page-break-after: always;
            position: relative;
        }
        .page:last-child { page-break-after: auto; }

        .header-table { width: 100%; border-collapse: collapse; border-top: 1px solid #d1d5db; border-bottom: 1px solid #d1d5db; margin-bottom: 12px; }
        .header-table td { padding: 8px; font-size: 11px; line-height: 1.6; vertical-align: middle; }
        .h-right { text-align: right; font-weight: bold; border-left: 1px solid #d1d5db; width: 33%; }
        .h-center { text-align: center; border-left: 1px solid #d1d5db; width: 34%; }
        .h-left { text-align: left; width: 33%; }

        .page-title { text-align: center; font-size: 18px; font-weight: bold; padding: 5px 0; border-top: 2px solid #e5e7eb; border-bottom: 2px solid #e5e7eb; margin-bottom: 10px; }

        .info-table { width: 100%; border-collapse: collapse; border: 1px solid #d1d5db; margin-bottom: 10px; text-align: center; }
        .info-table th { background-color: #d1d5db; font-weight: bold; padding: 4px; font-size: 10px; border: 1px solid #fff; }
        .info-table td { padding: 4px; font-size: 10px; border: 1px solid #d1d5db; background: #fff; }

        .grid-table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        .left-td { width: 65%; vertical-align: top; padding-left: 8px; }
        .right-td { width: 35%; vertical-align: top; border: 1px solid #d1d5db; }

        .driver-header { background-color: #d1d5db; font-weight: bold; padding: 4px; text-align: center; font-size: 10px; }
        .driver-img-box { text-align: center; padding: 5px; border-bottom: 1px solid #d1d5db; }
        .driver-row-label { background-color: #d1d5db; font-weight: bold; padding: 3px; text-align: center; font-size: 9px; border-bottom: 1px solid #fff; }
        .driver-row-value { padding: 3px; text-align: center; font-size: 9px; border-bottom: 1px solid #d1d5db; background: #fff; }

        .contract-section { border-top: 3px solid #000; padding-top: 8px; font-size: 9px; line-height: 1.7; text-align: justify; }
        .contract-section p { margin-bottom: 5px; }

        .inspection-title { font-weight: bold; font-size: 10px; margin: 4px 0 2px 0; }
        .inspection-table { width: 100%; border-collapse: collapse; border: 1px solid #000; text-align: center; font-size: 9px; margin-bottom: 4px; }
        .inspection-table th { background-color: #e5e7eb; font-weight: bold; border: 1px solid #000; padding: 2px; }
        .inspection-table td { border: 1px solid #000; padding: 2px; }

        .footer-table { width: 100%; border-collapse: collapse; border-top: 2px solid #000; padding-top: 5px; margin-top: 5px; }
        .footer-table td { vertical-align: middle; padding: 3px; }
        .footer-contact { text-align: center; font-size: 12px; font-weight: bold; }
        .page-num { text-align: center; font-size: 9px; margin-top: 3px; }
        .footer-img { width: 70px; }
    </style>
</head>
<body>
@php
    $settings = \App\Models\Setting::pluck('value', 'key')->toArray();
    $leader = $trip->booking->passengers->where('is_leader', true)->first() ?? $trip->booking->passengers->first();
    $whatsapp = $settings['whatsapp_number'] ?? '0552554803';

    // QR code as base64
    $qrUrl = route('trips.voucher', $trip->id);
    $qrApiUrl = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" . urlencode($qrUrl);
    $qrSrc = '';
    try {
        $qrData = @file_get_contents($qrApiUrl);
        if ($qrData) $qrSrc = 'data:image/png;base64,' . base64_encode($qrData);
    } catch (\Exception $e) {}

    // Logo as base64
    $logoPath = isset($settings['app_logo']) && $settings['app_logo'] ? public_path($settings['app_logo']) : public_path('new-stamp.jpeg');
    $logoSrc = '';
    if (file_exists($logoPath)) {
        $ext = strtolower(pathinfo($logoPath, PATHINFO_EXTENSION));
        $mime = $ext === 'png' ? 'image/png' : 'image/jpeg';
        $logoSrc = 'data:' . $mime . ';base64,' . base64_encode(file_get_contents($logoPath));
    }

    // Stamp as base64
    $stampPath = public_path('new-stamp.jpeg');
    $stampSrc = '';
    if (file_exists($stampPath)) {
        $stampSrc = 'data:image/jpeg;base64,' . base64_encode(file_get_contents($stampPath));
    }

    // Driver image as base64
    $driverSrc = '';
    if ($trip->driver && !empty($trip->driver->picture)) {
        $driverPath = public_path($trip->driver->picture);
        if (file_exists($driverPath)) {
            $ext = strtolower(pathinfo($driverPath, PATHINFO_EXTENSION));
            $mime = $ext === 'png' ? 'image/png' : 'image/jpeg';
            $driverSrc = 'data:' . $mime . ';base64,' . base64_encode(file_get_contents($driverPath));
        }
    }

    $crNumber = $settings['cr_number'] ?? '4031283847';
@endphp

{{-- ===== PAGE 1: CONTRACT ===== --}}
<div class="page">
    <table class="header-table">
        <tr>
            <td class="h-right">
                شركة معروف البركة المحدودة<br>
                رقم السجل التجاري: {{ $crNumber }}<br>
                مكة المكرمة
            </td>
            <td class="h-center">
                @if($logoSrc)<img src="{{ $logoSrc }}" style="max-height:65px; max-width:90px;"><br>@endif
                <span style="font-weight:bold; font-size:10px;">شركة معروف البركة المحدودة</span>
            </td>
            <td class="h-left">
                نوع التشغيل: نقل بين المدن<br>
                رقم المرجع: {{ $trip->id }}<br>
                تاريخ الإصدار: {{ \Carbon\Carbon::parse($trip->created_at)->format('d/m/Y') }}
            </td>
        </tr>
    </table>

    <div class="page-title">إبرام عقد بين الطرفين</div>

    <table class="grid-table">
        <tr>
            <td class="left-td">
                <div class="driver-header">معلومات الرحلة</div>
                <table class="info-table" style="margin-bottom:8px;">
                    <tr>
                        <th>من</th>
                        <th>الى</th>
                        <th>تاريخ و وقت المغادرة</th>
                    </tr>
                    <tr>
                        <td>{{ $trip->booking->route->from_location ?? 'N/A' }}</td>
                        <td>{{ $trip->booking->route->to_location ?? 'N/A' }}</td>
                        <td>{{ \Carbon\Carbon::parse($trip->date)->format('Y-m-d') }} | {{ $trip->time ? \Carbon\Carbon::parse($trip->time)->format('H:i') : '00:00' }}</td>
                    </tr>
                </table>
                <div class="driver-header">معلومات الركاب</div>
                <table class="info-table">
                    <tr>
                        <th>إسم الضيف الأساسي</th>
                        <th>رقم الجوال</th>
                        <th>عدد الركاب</th>
                    </tr>
                    <tr>
                        <td>{{ $leader->name ?? 'N/A' }}</td>
                        <td>{{ $trip->booking->contact ?? 'N/A' }}</td>
                        <td>{{ $trip->booking->pax_count ?? 0 }}</td>
                    </tr>
                </table>
            </td>
            <td class="right-td">
                <div class="driver-header">معلومات السائق</div>
                <div class="driver-img-box">
                    @if($driverSrc)
                        <img src="{{ $driverSrc }}" style="max-width:75px; max-height:75px;">
                    @else
                        <div style="width:75px;height:75px;background:#e5e7eb;margin:0 auto;"></div>
                    @endif
                </div>
                <div class="driver-row-label">السائق الأساسي</div>
                <div class="driver-row-value">{{ $trip->driver->name ?? 'N/A' }}</div>
                <div class="driver-row-label">رقم الهوية</div>
                <div class="driver-row-value">{{ $trip->driver->iqama_number ?? 'N/A' }}</div>
                <div class="driver-row-label">رقم الجوال</div>
                <div class="driver-row-value">{{ $trip->driver->phone ?? 'N/A' }}</div>
                <div class="driver-row-label">رقم اللوحة</div>
                <div class="driver-row-value">{{ $trip->vehicle->plate_number ?? 'N/A' }}</div>
            </td>
        </tr>
    </table>

    <div class="contract-section">
        <p>تم إبرام هذا العقد بين المتعاقدين بناءً على المادة (39) التاسعة والثلاثين من اللائحة المنظمة لنشاط النقل المتخصص وتأجير وتوجيه الحافلات، وبناءً على الفقرة (1) من المادة (39) التي تنص على أنه يجب على الناقل إبرام عقد نقل مع الأطراف المحددين في المادة (40) قبل تنفيذ عمليات النقل على الطرق الريفية، وبما لا يخالف أحكام هذه اللائحة ووفقاً للضوابط التي تحددها هيئة النقل.</p>
        <p>وبناءً على ما سبق، تم إبرام عقد النقل بين الأطراف الآتية:</p>
        <p style="text-align:center; margin:6px 0;">
            <u>الطرف الأول: شركة معروف البركة المحدودة رقم السجل التجاري: {{ $crNumber }}</u>
            &nbsp;&nbsp;&nbsp;
            <u>الطرف الثاني: {{ $leader->name ?? 'N/A' }}</u>
        </p>
        <p>- اتفق الطرفان على أن ينفذ الطرف الأول عملية النقل للطرف الثاني مع مرافقيه وذويهم من الموقع المحدد مسبقاً مع الطرف الثاني وتوصيلهم إلى الوجهة المحددة في العقد.</p>
        <p>- في حال إلغاء التعاقد لأي سبب شخصي أو أسباب أخرى تتعلق في الحجوزات أو الأنظمة تكون سياسة الإلغاء والاستبدال حسب نظام وزارة التجارة السعودية. في حالة الحجز وتم الإلغاء قبل موعد الرحلة بأكثر من 24 ساعة يتم استرداد المبلغ كامل.</p>
        <p>- في حال طلب الطرف الثاني الحجز من خلال الموقع الإلكتروني للمؤسسة، يعتبر هذا الحجز وموافقته على الشروط والأحكام بالموقع الإلكتروني هو موافقة على هذا العقد لتنفيذ عملية النقل المتفق عليها مع الطرف الأول.</p>
    </div>

    <br>
    <table class="footer-table">
        <tr>
            <td style="width:25%; text-align:right;">
                @if($stampSrc)<img src="{{ $stampSrc }}" class="footer-img">@endif
            </td>
            <td class="footer-contact">&#x2714; {{ $whatsapp }}</td>
            <td style="width:25%; text-align:left;">
                @if($qrSrc)<img src="{{ $qrSrc }}" class="footer-img">@endif
            </td>
        </tr>
    </table>
    <div class="page-num">1 / 3</div>
</div>

{{-- ===== PAGE 2: PASSENGER LIST ===== --}}
<div class="page">
    <table class="header-table">
        <tr>
            <td class="h-right">
                شركة معروف البركة المحدودة<br>
                رقم السجل التجاري: {{ $crNumber }}<br>
                مكة المكرمة
            </td>
            <td class="h-center">
                @if($logoSrc)<img src="{{ $logoSrc }}" style="max-height:65px; max-width:90px;"><br>@endif
                <span style="font-weight:bold; font-size:10px;">شركة معروف البركة المحدودة</span>
            </td>
            <td class="h-left">
                نوع التشغيل: نقل بين المدن<br>
                رقم المرجع: {{ $trip->id }}<br>
                تاريخ الإصدار: {{ \Carbon\Carbon::parse($trip->created_at)->format('d/m/Y') }}
            </td>
        </tr>
    </table>

    <div class="page-title">كشف ركاب</div>

    <div class="driver-header">معلومات الركاب</div>
    <table class="info-table">
        <tr>
            <th style="width:10%;">م</th>
            <th>إسم الضيف</th>
            <th>الجنسية</th>
            <th>رقم الهوية / الجواز</th>
        </tr>
        @foreach($trip->booking->passengers as $index => $passenger)
        <tr>
            <td>{{ $index + 1 }}.</td>
            <td>{{ $passenger->name }}</td>
            <td>{{ $passenger->nationality ?? 'N/A' }}</td>
            <td>{{ $passenger->iqama_number ?? 'N/A' }}</td>
        </tr>
        @endforeach
    </table>

    <br>
    <table class="footer-table">
        <tr>
            <td style="width:25%; text-align:right;">
                @if($stampSrc)<img src="{{ $stampSrc }}" class="footer-img">@endif
            </td>
            <td class="footer-contact">&#x2714; {{ $whatsapp }}</td>
            <td style="width:25%; text-align:left;">
                @if($qrSrc)<img src="{{ $qrSrc }}" class="footer-img">@endif
            </td>
        </tr>
    </table>
    <div class="page-num">2 / 3</div>
</div>

{{-- ===== PAGE 3: VEHICLE INSPECTION ===== --}}
<div class="page">
    <table class="header-table">
        <tr>
            <td class="h-right">
                شركة معروف البركة المحدودة<br>
                رقم السجل التجاري: {{ $crNumber }}<br>
                مكة المكرمة
            </td>
            <td class="h-center">
                @if($logoSrc)<img src="{{ $logoSrc }}" style="max-height:65px; max-width:90px;"><br>@endif
                <span style="font-weight:bold; font-size:10px;">شركة معروف البركة المحدودة</span>
            </td>
            <td class="h-left">
                نوع التشغيل: نقل بين المدن<br>
                رقم المرجع: {{ $trip->id }}<br>
                تاريخ الإصدار: {{ \Carbon\Carbon::parse($trip->created_at)->format('d/m/Y') }}
            </td>
        </tr>
    </table>

    <div class="page-title" style="font-size:16px;">سجل الفحص اليومي للسيارة</div>

    <table style="width:100%; font-size:10px; margin-bottom:8px;">
        <tr>
            <td style="text-align:right; width:50%;">اسم الشركة: شركة معروف البركة المحدودة</td>
            <td style="text-align:right; width:50%;">رقم الحافلة: {{ $trip->vehicle->id ?? 'N/A' }}</td>
        </tr>
        <tr>
            <td style="text-align:right;">لوحة المركبة: {{ $trip->vehicle->plate_number ?? 'N/A' }}</td>
            <td style="text-align:right;">تاريخ الفحص: {{ \Carbon\Carbon::parse($trip->date)->format('Y-m-d') }}</td>
        </tr>
    </table>

    <div class="inspection-title">أولاً: فحص مؤشرات لوحة القيادة</div>
    <table class="inspection-table">
        <tr><th style="width:40%;">البند</th><th style="width:15%;">سليم</th><th style="width:15%;">غير سليم</th><th style="width:30%;">ملاحظات</th></tr>
        <tr><td>مؤشر الوقود</td><td>&#x2714;</td><td></td><td></td></tr>
        <tr><td>مؤشر الحرارة</td><td>&#x2714;</td><td></td><td></td></tr>
        <tr><td>مؤشر ضغط الزيت</td><td>&#x2714;</td><td></td><td></td></tr>
        <tr><td>لمبة فحص المحرك</td><td>&#x2714;</td><td></td><td></td></tr>
        <tr><td>ABS</td><td>&#x2714;</td><td></td><td></td></tr>
        <tr><td>لمبات التحذير</td><td>&#x2714;</td><td></td><td></td></tr>
    </table>

    <div class="inspection-title">ثانياً: الفحص الخارجي</div>
    <table class="inspection-table">
        <tr><th style="width:40%;">البند</th><th style="width:15%;">سليم</th><th style="width:15%;">غير سليم</th><th style="width:30%;">ملاحظات</th></tr>
        <tr><td>الإطارات وضغط الهواء</td><td>&#x2714;</td><td></td><td></td></tr>
        <tr><td>الأنوار الأمامية و الخلفية</td><td>&#x2714;</td><td></td><td></td></tr>
        <tr><td>الإشارات التحذيرية</td><td>&#x2714;</td><td></td><td></td></tr>
        <tr><td>الزجاج والمرايا</td><td>&#x2714;</td><td></td><td></td></tr>
        <tr><td>عدم وجود تسريبات</td><td>&#x2714;</td><td></td><td></td></tr>
    </table>

    <div class="inspection-title">ثالثاً: أدوات ومتطلبات الأمن والسلامة</div>
    <table class="inspection-table">
        <tr><th style="width:40%;">البند</th><th style="width:15%;">سليم</th><th style="width:15%;">غير سليم</th><th style="width:30%;">ملاحظات</th></tr>
        <tr><td>طفاية حريق</td><td>&#x2714;</td><td></td><td></td></tr>
        <tr><td>مثلث تحذيري</td><td>&#x2714;</td><td></td><td></td></tr>
        <tr><td>حقيبة اسعافات أولية</td><td>&#x2714;</td><td></td><td></td></tr>
        <tr><td>مطرقة كسر الزجاج</td><td>&#x2714;</td><td></td><td></td></tr>
        <tr><td>أحزمة الأمان</td><td>&#x2714;</td><td></td><td></td></tr>
    </table>

    <div style="margin-top:8px; text-align:center;">
        <p style="font-weight:bold; font-size:12px; margin-bottom:4px;">إقرار</p>
        <p style="font-size:10px; margin-bottom:4px;">أقر انا السائق أعلاه بأنني قمت بفحص الحافلة و التأكد من سلامتها وجاهزيتها قبل التشغيل.</p>
        <p style="font-weight:bold; font-size:10px;">اسم السائق: {{ $trip->driver->user->name ?? ($trip->driver->name ?? 'N/A') }}</p>
    </div>

    <br>
    <table class="footer-table">
        <tr>
            <td style="width:25%; text-align:right;">
                @if($stampSrc)<img src="{{ $stampSrc }}" class="footer-img">@endif
            </td>
            <td class="footer-contact">&#x2714; {{ $whatsapp }}</td>
            <td style="width:25%; text-align:left;">
                @if($qrSrc)<img src="{{ $qrSrc }}" class="footer-img">@endif
            </td>
        </tr>
    </table>
    <div class="page-num">3 / 3</div>
</div>

</body>
</html>
