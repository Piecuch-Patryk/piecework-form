<?php
if(isset($_GET['size'])){
    $size = $_GET['size'];
    $data = $_GET['data'];
    	
    // db connection;
    require_once('./connection/db-conn-others.php');
    mysqli_report(MYSQLI_REPORT_STRICT);
    try {
        $connection = new mysqli($host, $db_user, $db_password, $db_name);
        // catch connection errors;
        if ($connection->connect_errno != 0) {
            throw new Exception(mysqli_connect_errno());
        } else {
            // get extras names;
            $result = $connection->query("SELECT * FROM `$data` WHERE `size`='$size'");
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