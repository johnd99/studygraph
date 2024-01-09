<?php

    include 'dbconnection.php';

    $name = $_POST['name'];

    $sql = "INSERT INTO graph (name) VALUES (?)";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$name]);

?>