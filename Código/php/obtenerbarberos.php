<?php
require_once("conexion.php");

$conexion = new Conexion();
$conectar = $conexion->conectar();

$barberos = [];

$sql = "SELECT * FROM usuarios WHERE Rol = 'barbero'";
$pdo = $conectar->prepare($sql);
$pdo->execute();

if ($pdo->rowCount() > 0) {
    while ($row = $pdo->fetch(PDO::FETCH_ASSOC)) {
        $barbero = array(
            'Nombre' => $row['Nombre'],
            'Id' => $row['ID_usuario']
        );
        $barberos[] = $barbero;
    }
}

echo json_encode($barberos);
?>
