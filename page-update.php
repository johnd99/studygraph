<?php

    $title = $_POST['title'];
    $body = $_POST['body'];
    $last_saved = $_POST['lastSaved'];
    $id = $_POST['id'];

    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "studygraph";
    
    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
        $sql = "UPDATE page SET title = \"$title\", body = \"$body\", last_saved = \"$last_saved\" WHERE id = $id";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
    } catch(PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
?>