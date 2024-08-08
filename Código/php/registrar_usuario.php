<?php
require_once("conexion.php");

$response = array();

try {
    $conexion = new Conexion();
    $conectar = $conexion->conectar();

    if ($conectar === null) {
        throw new Exception("Conexión fallida");
    }

    $nombre_usuario = $_POST['usuario'];
    $contrasena = $_POST['contrasena'];
    $nombre = $_POST['nombre'];
    $rol = $_POST['rol'];
    $correo = $_POST['correo'];
    $telefono = $_POST['telefono'];

    $parametros = array(
        ":nombre_usuario" => $nombre_usuario,
        ":contrasena" => $contrasena,
        ":nombre" => $nombre,
        ":rol" => $rol,
        ":correo" => $correo,
        ":telefono" => $telefono
    );

    $sql = "INSERT INTO usuarios (Nombre, Correo_electronico, Telefono, Usuario, Contrasena, Rol) VALUES (:nombre, :correo, :telefono, :nombre_usuario, :contrasena, :rol)";
    $pdo = $conectar->prepare($sql);
    $pdo->execute($parametros);
    
    if ($pdo->rowCount() > 0) {
        $response['success'] = true;
        $response['message'] = "Usuario registrado exitosamente";
    } else {
        $response['success'] = false;
        $response['message'] = "Error al registrar usuario";
    }
} catch (Exception $e) {
    $response['success'] = false;
    $response['message'] = "Error: " . $e->getMessage();
}

header('Content-Type: application/json');
echo json_encode($response);
?>
