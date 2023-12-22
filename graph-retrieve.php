<?php
    
    include 'dbconnection.php';

    $graph_id = $_POST['graph_id'];

    $sql = "SELECT id, title, xPosition, yPosition, connections FROM page WHERE graph_id = $graph_id";
    $stmt = $conn->prepare($sql);
    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);

?>