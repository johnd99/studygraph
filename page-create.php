<?php
  
    include 'dbconnection.php';

    $sql1 = "INSERT INTO page VALUES ();";
    $stmt1 = $conn->prepare($sql1);
    $stmt1->execute();

    $sql2 = "SELECT LAST_INSERT_ID();";
    $stmt2 = $conn->prepare($sql2);
    $stmt2->execute();

    $id = $stmt2->fetch(PDO::FETCH_COLUMN);
    echo $id;
        
?>