<?php

    $title = $_POST['title'];
    $body = $_POST['body'];
    $id = $_POST['id'];

    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "studygraph";
    
    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $imageData = null;
        if (isset($_FILES['imageInput']) && $_FILES['imageInput']['size'] > 0) {
            $imageData = file_get_contents($_FILES['imageInput']['tmp_name']);
        }

        if ($imageData) {
            $sql = "UPDATE page SET title = ?, body = ?, image_data = ? WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->execute([$title, $body, $imageData, $id]);
        } else {
            $sql = "UPDATE page SET title = ?, body = ? WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->execute([$title, $body, $id]);
        }
    
        //$sql = "UPDATE page SET title = \"$title\", body = \"$body\" WHERE id = $id";
        //$stmt = $conn->prepare($sql);
        //$stmt->execute();
    } catch(PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
?>