<?php
require_once("conexion.php");

$response = array();

try {
    $conexion = new Conexion();
    $conectar = $conexion->conectar();

    if ($conectar === null) {
        throw new Exception("Conexión fallida");
    }

    $id_barbero = $_POST['barberoId'];
    $fechaActual = new DateTime();
    $fechaActual->setTime(0, 0);
    $fechaActualStr = $fechaActual->format('Y-m-d');

    $sql = "SELECT * FROM citas WHERE ID_barbero = :id_barbero AND Fecha = :fecha";
    $pdo = $conectar->prepare($sql);
    $pdo->bindParam(':id_barbero', $id_barbero, PDO::PARAM_INT);
    $pdo->bindParam(':fecha', $fechaActualStr, PDO::PARAM_STR);
    $pdo->execute();
    $citas = $pdo->fetchAll(PDO::FETCH_ASSOC);
    foreach ($citas as &$cita) {
        $id_servicio = $cita['ID_servicio'];

        $sql_servicio = "SELECT Nombre_servicio FROM servicios WHERE ID_servicio=:id_servicio";
        $pdo_servicio = $conectar->prepare($sql_servicio);
        $pdo_servicio->bindParam(':id_servicio', $id_servicio, PDO::PARAM_INT);
        $pdo_servicio->execute();
        $servicio = $pdo_servicio->fetch(PDO::FETCH_ASSOC);

            $cita['nombre_servicio'] = $servicio['Nombre_servicio'];
    }
    $response['success'] = true;
    $response['citas'] = $citas;
} catch (Exception $e) {
    $response['success'] = false;
    $response['message'] = $e->getMessage();
}

header('Content-Type: application/json');
echo json_encode($response);
?>
