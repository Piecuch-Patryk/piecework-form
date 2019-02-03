<?php
if(isset($_GET['range'])){
    $str = $_GET['range'];
    // db connection;
    require_once('../connection/db-conn-sheds.php');
    mysqli_report(MYSQLI_REPORT_STRICT);
    try {
        $connection = new mysqli($host, $db_user, $db_password, $db_name);
        // catch connection errors;
        if ($connection->connect_errno != 0) {
            throw new Exception(mysqli_connect_errno());
        } else {
            // get all sizes of chosen range;
            $result = $connection->query("SELECT * FROM `$str` WHERE 1");
            $row = mysqli_fetch_all($result,MYSQLI_ASSOC);
            $connection->close();
            echo json_encode($row);
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