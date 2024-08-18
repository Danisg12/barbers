<?php
require_once("conexion.php");

$response = array();

try {
    $conexion = new Conexion();
    $conectar = $conexion->conectar();

    if ($conectar === null) {
        throw new Exception("Conexión fallida");
    }

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $sql = "SELECT * FROM usuarios";
        $pdo = $conectar->prepare($sql);
        $pdo->execute();
        $usuarios = $pdo->fetchAll(PDO::FETCH_ASSOC);

        $response['success'] = true;
        $response['usuario'] = $usuarios;
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
        if ($_POST['action'] === 'eliminar') {
            $id = $_POST['id'];
            $parametros=array(":id" => $id);
            $sql = "DELETE FROM usuarios WHERE ID_usuario = :id";
            $pdo = $conectar->prepare($sql);
            $pdo->execute($parametros);

            $response['success'] = true;
            $response['message'] = "Usuario eliminado ";
        } 
    }
} catch (Exception $e) {
    $response['success'] = false;
    $response['message'] = $e->getMessage();
}

header('Content-Type: application/json');
echo json_encode($response);
?>
