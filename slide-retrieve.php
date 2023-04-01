<?php
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "studygraph";
    
    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
        $sql = "SELECT body FROM slide WHERE id = 1";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
    
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);
        
    } catch(PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
?>