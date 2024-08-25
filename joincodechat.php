<?php
// Assuming you have a database connection established
$servername = "localhost";
$username = "codechat_group_chats";
$password = "Codechat=2023";
$dbname = "codechat_DB0";

// Check if the link exists as a table in the database
function linkExists($tableName, $connection) {
    $sql = "SHOW TABLES LIKE '$tableName'";
    $result = $connection->query($sql);
    return $result->num_rows > 0;
}

// Check if the email exists in the table
function emailExists($email, $tableName, $connection) {
    $sql = "SELECT email FROM $tableName WHERE email = '$email'";
    $result = $connection->query($sql);
    return $result->num_rows > 0;
}

// Add the user to the table
function addUser($email, $msg, $tableName, $connection) {
    $role = 'participant';
    $timeStamp = date("D M d Y H:i:s");
    
    $sql = "INSERT INTO $tableName (email, role, msg, timeStamp) VALUES ('$email', '$role', '$msg', '$timeStamp')";
    if ($connection->query($sql) === TRUE) {
        error_log("User added successfully");
    } else {
        echo "Error adding user: " . $connection->error;
        exit;
    }
}

// Handle the POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $tableName = $_POST['linkCode'];
    $email = $_POST['joinEmail'];

    // Check if the link exists as a table in the database
    $connection = new mysqli($servername, $username, $password, $dbname);
    if ($connection->connect_error) {
        die("Connection failed: " . $connection->connect_error);
    }

    if (linkExists($tableName, $connection)) {
        // Check if the email exists in the table
        if (!emailExists($email, $tableName, $connection)) {
            addUser($email, "$email joined the group", $tableName, $connection);
        } else {
            addUser($email, "$email is back", $tableName, $connection);
        }
        $redirectUrl = "https://codechat.co.za/cc.html?code=$tableName&role=participate&userID=$email";
        header("Location: $redirectUrl");
        exit;
    } else {
        $redirectUrl = "https://codechat.co.za/createcc.html";
        echo "<script>alert('Link does not exist. Please create a link below.');window.location.href='$redirectUrl';</script>";
        exit;
    }
}
?>
