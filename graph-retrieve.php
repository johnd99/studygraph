<?php
    
    include 'dbconnection.php';

    $sql = "SELECT id, title, xPosition, yPosition, connections FROM page ORDER BY id";
    $stmt = $conn->prepare($sql);
    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);

?>