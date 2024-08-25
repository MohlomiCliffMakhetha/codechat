<?php
// Database configuration
$servername = "localhost";
$username = "codechat_group_chats";
$password = "Codechat=2023";
$dbname = "codechat_DB0";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Get the POST data
$data = json_decode(file_get_contents('php://input'), true);

// Extract the data
$code = $data['code'];
$role = $data['role'];
$userID = $data['userID'];
$msg = $data['msg'];
$timeStamp = $data['timeStamp'];

// Prepare the SQL statement
$stmt = $conn->prepare("INSERT INTO $code (email, role, msg, timeStamp) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $userID, $role, $msg, $timeStamp);

// Execute the statement
if ($stmt->execute()) {
  // Insertion successful
  $response = [
    'status' => 'success',
    'message' => 'Data inserted successfully.'
  ];
  echo json_encode($response);
} else {
  // Insertion failed
  $response = [
    'status' => 'error',
    'message' => 'Failed to insert data: ' . $stmt->error
  ];
  echo json_encode($response);
}

// Close the statement and database connection
$stmt->close();
$conn->close();
?>
