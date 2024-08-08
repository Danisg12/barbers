<?php
session_start();
require_once("conexion.php");

$response = array();

try {
    $conexion = new Conexion();
    $conectar = $conexion->conectar();

    if ($conectar === null) {
        throw new Exception("Conexión fallida");
    }

    $usuario = $_POST['usuario'];
    $contrasena = $_POST['contrasena'];
    
    $sql = "SELECT ID_usuario, nombre, rol FROM usuarios WHERE Usuario = :usuario AND Contrasena = :contrasena";
    $parametros = array(':usuario' => $usuario, ':contrasena' => $contrasena);
    $pdo = $conectar->prepare($sql);
    $pdo->execute($parametros);

    if ($row = $pdo->fetch(PDO::FETCH_ASSOC)) {
        $_SESSION['user_id'] = $row['ID_usuario'];
        $_SESSION['user_name'] = $row['nombre'];
        $_SESSION['user_role'] = $row['rol'];

        $response['success'] = true;
        $response['id'] = $row['ID_usuario'];
        $response['nombre'] = $row['nombre'];
        $response['rol'] = $row['rol'];
    } else {
        $response['success'] = false;
        $response['message'] = "Usuario o contraseña incorrectos";
    }
} catch (Exception $e) {
    error_log("Error: " . $e->getMessage());
    $response['success'] = false;
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
?>
