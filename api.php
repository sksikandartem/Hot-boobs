<?php
// Set headers for CORS and JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Simulate a delay for API processing
usleep(mt_rand(1000000, 3000000)); // 1 to 3 second delay

$response = [
    'success' => false,
    'message' => 'Invalid action or request method.'
];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $action = $_POST['action'];

    if ($action === 'url_upload' && isset($_POST['video_url'])) {
        $videoUrl = filter_var($_POST['video_url'], FILTER_SANITIZE_URL);
        
        // Basic URL validation simulation
        if (!filter_var($videoUrl, FILTER_VALIDATE_URL)) {
            $response = [
                'success' => false,
                'message' => 'Invalid video URL provided.'
            ];
        } else {
            // SIMULATE API CALLS to 3 different hosts
            
            // Generate unique IDs for simulation
            $rpmId = bin2hex(random_bytes(8));
            $abyssId = bin2hex(random_bytes(8));
            $streamHgId = bin2hex(random_bytes(8));
            
            // Build the simulated response
            $response = [
                'success' => true,
                'message' => 'Video uploaded to multiple hosts successfully.',
                'original_url' => $videoUrl,
                'links' => [
                    // IMPORTANT: Using the specific format requested for RPMShare
                    'RPMShare' => "https://playlinkhub.rpmvid.com/#{$rpmId}",
                    'Abyss' => "https://abyss.to/embed/{$abyssId}",
                    'StreamHG' => "https://streamhg.com/v/{$streamHgId}"
                ]
            ];
        }
    }
}

echo json_encode($response);
?>
