<?php

    include 'dbconnection.php';

    $graph_id = $_POST['id'];

    $sql1 = "DELETE FROM page WHERE graph_id = $graph_id";
    $stmt1 = $conn->prepare($sql1);
    $stmt1->execute();

    $sql2 = "DELETE FROM graph WHERE id = $graph_id";
    $stmt2 = $conn->prepare($sql2);
    $stmt2->execute();

?>