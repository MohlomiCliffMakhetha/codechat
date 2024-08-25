<?php
// Assuming you have a database connection established
$servername = "localhost";
$username = "codechat_group_chats";
$password = "Codechat=2023";
$dbname = "codechat_DB0";

// Create a new table in the database
function createTable($tableName, $connection) {
    $sql = "CREATE TABLE $tableName (
                email VARCHAR(50),
                role VARCHAR(10),
                msg VARCHAR(3000),
                timeStamp VARCHAR(30)
            )";
    
    if ($connection->query($sql) === TRUE) {
        error_log("Table $tableName created successfully");
    } else {
        echo "Error creating table: " . $connection->error;
        exit;
    }
}

// Generate a 16 character hex number starting with "codechat"
function generateHashCode($email) {
    $hashedEmail = 'codechat' . substr(md5($email), 0, 19);
    return $hashedEmail;
}

// Store the email in the database
function storeEmail($email, $role, $msg, $connection) {
    $tableName = generateHashCode($email);
    createTable($tableName, $connection);
    
    $timeStamp = date("D M d Y H:i:s");
    
    $sql = "INSERT INTO $tableName (email, role, msg, timeStamp) VALUES ('$email', '$role', '$msg', '$timeStamp')";
    if ($connection->query($sql) === TRUE) {
        error_log("Email stored successfully");
    } else {
        echo "Error storing email: " . $connection->error;
        exit;
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['createEmail'];

    // Store the email in the database
    $connection = new mysqli($servername, $username, $password, $dbname);
    if ($connection->connect_error) {
        die("Connection failed: " . $connection->connect_error);
    }
    $tableName = generateHashCode($email);
    $redirectUrl = "https://codechat.co.za/createcc.html?code=$tableName";
    $role = 'admin';
    $msg = "### Hi 👋, here is the [link]($redirectUrl) for the group chat: 
\`\`\`url
$redirectUrl
\`\`\`";
    storeEmail($email, $role, $msg, $connection);
    $redirectUrl = "https://codechat.co.za/cc.html?code=$tableName&role=$role&userID=$email";
    header("Location: $redirectUrl");
    exit;
}
?>