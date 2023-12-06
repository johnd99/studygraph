<?php
  
    include 'dbconnection.php';

    $id = $_POST['id'];

    $sql = "SELECT id, title, body, image_reference FROM page WHERE id = $id";
    $stmt = $conn->prepare($sql);
    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    //$data[0]['image_data'] = base64_encode($data[0]['image_data']);
    echo json_encode($data);
        
?>