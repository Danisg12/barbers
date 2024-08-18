<?php
require_once("Scheudable.php"); 

$conexion = new Conexion();
$conectar = $conexion->conectar();

$recordatorioCitas = new RecordatorioCitas($conectar);
$recordatorioCitas->enviarRecordatorios();

header('Location:../html/index.html');
exit();
?>
