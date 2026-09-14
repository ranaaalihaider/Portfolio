<?php

$all_files = [];
function getFiles($dir) {
    global $all_files;
    $files = glob($dir . '/*');
    foreach ($files as $f) {
        if (is_dir($f)) getFiles($f);
        elseif (str_ends_with($f, '.blade.php')) $all_files[] = $f;
    }
}
getFiles(__DIR__ . "/resources/views");

foreach ($all_files as $f) {
    $content = file_get_contents($f);
    if (!str_contains($content, '<thead>')) continue;
    
    preg_match_all('/<th>(.*?)<\/th>/is', $content, $matches);
    if (empty($matches[1])) continue;
    $headers = array_map('trim', $matches[1]);
    
    preg_match('/<tbody>(.*?)<\/tbody>/is', $content, $tbody_match);
    if (empty($tbody_match[1])) continue;
    $tbody = $tbody_match[1];
    
    preg_match_all('/<tr.*?>(.*?)<\/tr>/is', $tbody, $tr_matches);
    $new_tbody = $tbody;
    
    foreach ($tr_matches[0] as $tr_full) {
        // use preg_match_all for tds in this tr
        preg_match_all('/<td([^>]*)>(.*?)<\/td>/is', $tr_full, $td_matches);
        if (count($td_matches[0]) === count($headers)) {
            $new_tr = $tr_full;
            for ($i = 0; $i < count($headers); $i++) {
                $label = strip_tags($headers[$i]);
                $old_td = $td_matches[0][$i];
                if (!str_contains($old_td, 'data-label')) {
                    $new_td = '<td data-label="' . htmlspecialchars($label) . '"' . $td_matches[1][$i] . '>' . $td_matches[2][$i] . '</td>';
                    // We must replace only the first occurrence or specific exact match, but since $old_td includes the specific content, it's fine.
                    // to avoid replacing multiple identical tds incorrectly, we use str_replace or preg_replace
                    $new_tr = implode($new_td, explode($old_td, $new_tr, 2));
                }
            }
            $new_tbody = str_replace($tr_full, $new_tr, $new_tbody);
        }
    }
    
    if ($tbody !== $new_tbody) {
        $content = str_replace($tbody, $new_tbody, $content);
        file_put_contents($f, $content);
        echo "Successfully updated $f\n";
    }
}
echo "Done!\n";
