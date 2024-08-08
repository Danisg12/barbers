<?php
require_once("conexion.php");

$response = array();

try {
    $conexion = new Conexion();
    $conectar = $conexion->conectar();

    if ($conectar === null) {
        throw new Exception("Conexión fallida");
    }

    $fecha = $_POST['Fecha'];
    $barbero = $_POST['Barbero']; 
    $sql = "SELECT Hora, ID_servicio FROM citas WHERE Fecha = :fecha AND ID_barbero = :barbero";
    $parametros = array(':fecha' => $fecha, ':barbero' => $barbero);
    $pdo = $conectar->prepare($sql);
    $pdo->execute($parametros);

    $horasReservadas = [];
    while ($row = $pdo->fetch(PDO::FETCH_ASSOC)) {
        $horasReservadas[$row['Hora']] = $row['ID_servicio'];
    }

    $duraciones = [];
    if (!empty($horasReservadas)) {
        $idsServicios = array_unique(array_values($horasReservadas));
        $idsServiciosStr = implode(',', array_map('intval', $idsServicios));

        $sqlServicios = "SELECT ID_servicio, Duracion FROM servicios WHERE ID_servicio IN ($idsServiciosStr)";
        $pdoServicios = $conectar->prepare($sqlServicios);
        $pdoServicios->execute();

        while ($row = $pdoServicios->fetch(PDO::FETCH_ASSOC)) {
            $duraciones[$row['ID_servicio']] = $row['Duracion'];
        }
    }

    $horasDisponibles = [];
    $horasInicio = ['10:00', '16:00'];
    $horasFin = ['14:00', '20:00'];

    foreach ($horasInicio as $index => $inicio) {
        $horaInicio = new DateTime($fecha . ' ' . $inicio);
        $horaFin = new DateTime($fecha . ' ' . $horasFin[$index]);

        while ($horaInicio < $horaFin) {
            $horaStr = $horaInicio->format('H:i');

            if (!isset($horasReservadas[$horaStr])) {
                $horasDisponibles[] = $horaStr;
                $horaInicio->modify("+30 minutes");
            } else {
                $idServicio = $horasReservadas[$horaStr];
                $duracion = isset($duraciones[$idServicio]) ? $duraciones[$idServicio] : 30;
                $horaInicio->modify("+{$duracion} minutes");
            }
        }
    }

    echo json_encode($horasDisponibles);
} catch (Exception $e) {
    error_log("Error: " . $e->getMessage());
    echo json_encode(['error' => $e->getMessage()]);
}
?>
