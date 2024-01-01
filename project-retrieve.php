<?php

    include 'dbconnection.php';

    $sql = "SELECT id, name FROM graph";
    $stmt = $conn->prepare($sql);
    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);

?>