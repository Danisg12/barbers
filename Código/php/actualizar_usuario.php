<?php
require_once("conexion.php");

$response = array();

try {
    $conexion = new Conexion();
    $conectar = $conexion->conectar();

    if ($conectar === null) {
        throw new Exception("Conexión fallida");
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $id = $_POST['id'];
        $usuario = $_POST['usuario'];
        $contrasena = $_POST['contrasena'];
        $nombre = $_POST['nombre'];
        $correo = $_POST['correo'];
        $telefono = $_POST['telefono'];
       

        $sql = "UPDATE usuarios SET Usuario = :usuario, Nombre = :nombre, Correo_electronico = :correo, Telefono = :telefono";
        if (!empty($contrasena)) {
            $sql .= ", Contrasena = :contrasena";
        }
        $sql .= " WHERE ID_usuario = :id";

        $pdo = $conectar->prepare($sql);
        $parametros = array(
            ":usuario" => $usuario,
            ":nombre" => $nombre,
            ":correo" => $correo,
            ":telefono" => $telefono,
            ":id" => $id
        );

        if (!empty($contrasena)) {
            $parametros[":contrasena"] = $contrasena;
        }

        $pdo->execute($parametros);

        $response['success'] = true;
        $response['message'] = "Usuario actualizado con éxito";
    }
} catch (Exception $e) {
    $response['success'] = false;
    $response['message'] = $e->getMessage();
}

header('Content-Type: application/json');
echo json_encode($response);
?>
