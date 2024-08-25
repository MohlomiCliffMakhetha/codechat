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

$data = json_decode(file_get_contents('php://input'), true);

// Extract the data
$code = $data['code'];
$email = $data['email']; // Change 'userID' to 'email' to match the key in the JavaScript data object

// Prepare the SQL statement to check if the userID (email) exists in the table
$stmt = $conn->prepare("SELECT COUNT(*) AS count FROM $code WHERE email = ?"); // Change 'userID' to 'email' to match the column name

// Bind the email parameter
$stmt->bind_param("s", $email);

// Execute the statement
$stmt->execute();

// Get the result set
$result = $stmt->get_result();

// Fetch the count value
$row = $result->fetch_assoc();
$count = $row['count'];

// Close the statement
$stmt->close();

// Check if the userID exists in the table
if ($count > 0) {
  // Prepare the SQL statement to fetch new messages
  //$stmt = $conn->prepare("SELECT * FROM $code ORDER BY timeStamp ASC");
  $stmt = $conn->prepare("SELECT * FROM $code ORDER BY STR_TO_DATE(timeStamp, '%a %b %d %Y %H:%i:%s') ASC");


  // Execute the statement
  $stmt->execute();

  // Get the result set
  $result = $stmt->get_result();

  // Fetch the new messages
  $messages = [];
  while ($row = $result->fetch_assoc()) {
    $messages[] = [
      'timeStamp' => $row['timeStamp'],
      'userID' => $row['email'],
      'msg' => $row['msg']
    ];
  }

  // Close the statement
  $stmt->close();

  // Return the new messages as JSON response
  header('Content-Type: application/json');
  echo json_encode($messages);
} else {
  // Return an empty array as JSON response when no new messages
  header('Content-Type: application/json');
  echo json_encode([]);
}

// Close the database connection
$conn->close();

?>