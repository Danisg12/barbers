<?php
session_start();
header('Content-Type: application/json');

$response = array();

if (isset($_SESSION['user_id']) && isset($_SESSION['user_name'])) {
    $response['success'] = true;
    $response['id'] = $_SESSION['user_id'];
    $response['nombre'] = $_SESSION['user_name'];
    $response['rol'] = $_SESSION['user_role'];
} else {
    $response['success'] = false;
    $response['message'] = "Usuario no autenticado";
}

echo json_encode($response);
?>
