<?php

    include 'dbconnection.php';

    $json_data = file_get_contents("php://input");
    $data = json_decode($json_data, true);

    $locations = $data["locations"];
    $connections = $data["connections"];
    
    foreach ($locations as $id => $coordinates) {
        $xPosition = $coordinates[0];
        $yPosition = $coordinates[1];
        $sql = "UPDATE page SET xPosition = $xPosition, yPosition = $yPosition WHERE id = $id";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
    }

    foreach ($connections as $id => $list) {
        $group = implode(", ", $list);
        $sql = "UPDATE page SET connections = \"$group\" WHERE id = $id";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
    }

?>
