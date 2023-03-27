<?php
    $conn = new mysqli("localhost", "root", "", "studygraph");
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    $body = $_POST['body'];
    $stmt = $conn->prepare("UPDATE slide SET body = \"$body\" WHERE id = 1");
    $stmt->execute();
    $stmt->close();
    header('Location: slide.php');
?>