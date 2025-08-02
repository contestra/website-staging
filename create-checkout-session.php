<?php
// Stripe Checkout Session Creator
// This file handles secure server-side creation of Stripe checkout sessions

// Enable CORS for your domain
header('Access-Control-Allow-Origin: https://contestra.com'); // Replace with your actual domain
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Include Stripe PHP library
require_once 'stripe-php/init.php';

// Include configuration file (contains secret key)
require_once 'config.php';

// Set your secret key from config
\Stripe\Stripe::setApiKey(STRIPE_SECRET_KEY);

try {
    // Get the JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['priceId'])) {
        throw new Exception('Price ID is required');
    }
    
    $priceId = $input['priceId'];
    $mode = $input['mode'] ?? 'subscription'; // Default to subscription
    
    // Create Checkout Session
    $session = \Stripe\Checkout\Session::create([
        'mode' => $mode,
        'line_items' => [[
            'price' => $priceId,
            'quantity' => 1,
        ]],
        'success_url' => 'https://contestra.com/success.html?session_id={CHECKOUT_SESSION_ID}',
        'cancel_url' => 'https://contestra.com/pricing.html',
        // Optional: collect billing address
        'billing_address_collection' => 'required',
        // Optional: allow promotion codes
        'allow_promotion_codes' => true,
        // Optional: customer email (if you have it)
        // 'customer_email' => $input['email'] ?? null,
    ]);
    
    echo json_encode(['sessionId' => $session->id]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}
?>