<?php
if(isset($_GET['ranges'])){
    // db connection;
    require_once('../connection/db-conn-sheds.php');
    mysqli_report(MYSQLI_REPORT_STRICT);
    try {
        $connection = new mysqli($host, $db_user, $db_password, $db_name);
        // catch connection errors;
        if ($connection->connect_errno != 0) {
            throw new Exception(mysqli_connect_errno());
        } else {
            // get all ranges;
            $result = $connection->query("SHOW TABLES FROM `wages-sheds`");
            $ranges = [];
            while ($row = $result->fetch_array()) {
                array_push($ranges, $row[0]);
            }
            $connection->close();
            echo json_encode($ranges);
            exit();
        }
    } catch (Exception $e) {
        echo 'server error'.'<br/>';
        // development use only;
        echo $e;
    }
}else {
    $json = json_encode('error');
    echo $json;
    exit();
}
?>