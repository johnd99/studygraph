<?php

    include 'dbconnection.php';

    $title = $_POST['page-title'];
    $body = $_POST['page-body'];
    $id = $_POST['id'];
    if (isset($_FILES['imageInput']) && $_FILES['imageInput']['size'] > 0) {
        $targetDirectory = "../studygraph/images/";
        $filename = basename($_FILES['imageInput']['name']);
        $targetFilePath = $targetDirectory . $filename;

        if (move_uploaded_file($_FILES['imageInput']['tmp_name'], $targetFilePath)) {
            $sql = "UPDATE page SET title = ?, body = ?, image_reference = ? WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->execute([$title, $body, $targetFilePath, $id]);
        } else {
            echo "Error uploading image";
        }

    } else {
        $sql = "UPDATE page SET title = ?, body = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$title, $body, $id]);
    }
        
?>