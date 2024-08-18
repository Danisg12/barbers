<?php
require_once("conexion.php");

$response = array();

try {
    $conexion = new Conexion();
    $conectar = $conexion->conectar();

    if ($conectar === null) {
        throw new Exception("Conexión fallida");
    }

    $ID_cliente = $_POST['Cliente'];
    $ID_barbero =  $_POST['ID_barbero']; 
    $ID_servicio =$_POST['Servicio'];
    $Fecha = $_POST['Fecha'];
    $Hora = $_POST['Hora'];

    if (empty($ID_cliente) || empty($ID_barbero) || empty($ID_servicio) || empty($Fecha) || empty($Hora)) {
        throw new Exception("Falta un campo");
    }
    $parametros = array(
        ":ID_cliente" => $ID_cliente,
        ":ID_barbero" => $ID_barbero,
        ":ID_servicio" => $ID_servicio,
        ":Fecha" => $Fecha,
        ":Hora" => $Hora
    );
    $fechaCita = new DateTime($Fecha);
    $fechaActual = new DateTime();
    $fechaCita->setTime(0, 0);
$fechaActual->setTime(0, 0);
    if($fechaCita < $fechaActual){
        $response['success'] = true;
        $response['message'] = "No puedes pedir cita de un día que ya pasó";
    }else{
        $sql = "INSERT INTO citas (ID_cliente, ID_barbero, ID_servicio, Fecha, Hora) VALUES (:ID_cliente, :ID_barbero, :ID_servicio, :Fecha, :Hora)";
    $pdo = $conectar->prepare($sql);    
    $pdo->execute($parametros);

    if ($pdo->rowCount() > 0) {
        $response['success'] = true;
        $response['message'] = "Cita registrada ";
    } else {
        $response['success'] = false;
        $response['message'] = "Error al registrar la cita";
    }
} 
    }catch (Exception $e) {
        $response['success'] = false;
        $response['message'] = $e->getMessage();
    }
    

header('Content-Type: application/json');
echo json_encode($response);
?>
