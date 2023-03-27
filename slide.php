<?php
    $conn = new mysqli("localhost", "root", "", "studygraph");
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    $stmt = $conn->prepare("SELECT body FROM slide WHERE id = 1");
    $stmt->execute();
    $stmt->store_result();
    $stmt->bind_result($body);
    $stmt->fetch();
    $stmt->close();
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <link href="styles.css" rel="stylesheet">
        <title>Slide</title>
    </head>
    <body>
        <form action="slide-update.php" method="post">
            <textarea name="body" rows="4" cols="50"><?php echo($body) ?></textarea>
            <input type="submit" value="Save" />
        </form>
    </body>
</html>