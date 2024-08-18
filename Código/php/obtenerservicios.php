<?php
require_once("conexion.php");

$conexion = new Conexion();
$conectar = $conexion->conectar();

$barberos = [];

$sql = "SELECT * FROM servicios";
$pdo = $conectar->prepare($sql);
$pdo->execute();

if ($pdo->rowCount() > 0) {
    while ($row = $pdo->fetch(PDO::FETCH_ASSOC)) {
        $barbero = array(
            'Nombre' => $row['Nombre_servicio'],
            'Id' => $row['ID_servicio']
        );
        $barberos[] = $barbero;
    }
}

echo json_encode($barberos);
?>
