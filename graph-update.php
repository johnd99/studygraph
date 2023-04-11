<?php
    $json_data = file_get_contents("php://input");
    $data = json_decode($json_data, true);

    $locations = $data["locations"];
    $connections = $data["connections"];
    
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "studygraph";
    
    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

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

    } catch(PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
?>
