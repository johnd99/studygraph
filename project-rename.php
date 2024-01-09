<?php

    include 'dbconnection.php';

    $id = $_POST['id'];
    $name = $_POST['name'];

    $sql = "UPDATE graph SET name = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$name, $id]);

?>