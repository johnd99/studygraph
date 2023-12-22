<?php
  
    include 'dbconnection.php';

    $id = $_POST['id'];

    $sql = "SELECT id, title, body, image_reference FROM page WHERE id = $id";
    $stmt = $conn->prepare($sql);
    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);
        
?>