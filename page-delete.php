<?php
    $deleteId = $_POST['id'];

    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "studygraph";
    
    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql1 = "DELETE FROM page WHERE id = $deleteId;";
        $stmt1 = $conn->prepare($sql1);
        $stmt1->execute();

        $sql2 = "SELECT id, connections FROM page";
        $stmt2 = $conn->prepare($sql2);
        $stmt2->execute();
        $prevConnections = $stmt2->fetchAll(PDO::FETCH_ASSOC);

        for ($i = 0; $i < count($prevConnections); $i++) {
            $id = $prevConnections[$i]['id'];
            $prevGroup = $prevConnections[$i]['connections'];
            
            $list = explode(", ", $prevGroup);
            $index = array_search($deleteId, $list);
            if ($index !== false) {
                unset($list[$index]);
                $newGroup = implode(", ", $list);
                $sql3 = "UPDATE page SET connections = \"$newGroup\" WHERE id = $id;";
                $stmt3 = $conn->prepare($sql3);
                $stmt3->execute();
            }
        }
        
    } catch(PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
?>