<?php

    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "studygraph";
    
    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        $id = $_POST['id'];
        if ($id == -1) {
            $sql1 = "INSERT INTO page VALUES ();";
            $stmt1 = $conn->prepare($sql1);
            $stmt1->execute();

            $sql2 = "SELECT LAST_INSERT_ID();";
            $stmt2 = $conn->prepare($sql2);
            $stmt2->execute();
            $id = $stmt2->fetch(PDO::FETCH_COLUMN);
        }
        $sql = "SELECT id, title, body, image_data FROM page WHERE id = $id";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
    
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $data[0]['image_data'] = base64_encode($data[0]['image_data']);
        echo json_encode($data);
        
    } catch(PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
?>