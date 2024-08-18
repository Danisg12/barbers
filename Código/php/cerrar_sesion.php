<?php
session_start();
session_destroy();
$response = array('success' => true, 'message' => 'Sesión cerrada correctamente');
echo json_encode($response);
?>
