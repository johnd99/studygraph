<?php

    include 'dbconnection.php';

    $title = $_POST['page-title'];
    $body = $_POST['page-body'];
    $id = $_POST['id'];

    if (isset($_FILES['imageInput']) && $_FILES['imageInput']['size'] > 0) {
        $imageData = file_get_contents($_FILES['imageInput']['tmp_name']);
        $sql = "UPDATE page SET title = ?, body = ?, image_data = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$title, $body, $imageData, $id]);
    } else {
        $sql = "UPDATE page SET title = ?, body = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$title, $body, $id]);
    }
        
?>