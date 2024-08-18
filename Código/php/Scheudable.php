<?php
require_once("conexion.php");

class RecordatorioCitas {
    private $conexion;

    public function __construct($conexion) {
        $this->conexion = $conexion;
    }

    public function enviarRecordatorios() {
        $sql = "SELECT c.ID_cita, c.Fecha, c.Hora, u.Correo_electronico, u.Nombre, s.Nombre_servicio
                FROM citas c
                JOIN usuarios u ON c.ID_cliente = u.ID_usuario
                JOIN servicios s ON c.ID_servicio = s.ID_servicio
                WHERE c.Fecha = CURDATE() -- + INTERVAL 1 DAY
                AND c.recordatorio_enviado = FALSE";

        $stmt = $this->conexion->prepare($sql);
        $stmt->execute();
        $citas = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($citas as $cita) {
            $this->enviarCorreo($cita);
            $this->marcarRecordatorioEnviado($cita['ID_cita']);
        }
    }

    private function enviarCorreo($cita) {
        $to = $cita['Correo_electronico'];
        $subject = "Recordatorio de su cita para mañana";
        $message = "Hola " . $cita['Nombre'] . ",\n\nEste es un recordatorio de su cita para el servicio de " . $cita['Nombre_servicio'] . " programada para mañana a las " . $cita['Hora'] . ".\n\n¡Nos vemos pronto!";
        $headers = "From: miguelanezd@gmail.com";

        mail($to, $subject, $message, $headers);
    }

    private function marcarRecordatorioEnviado($idCita) {
        $sql = "UPDATE citas SET recordatorio_enviado = TRUE WHERE ID_cita = :id";
        $stmt = $this->conexion->prepare($sql);
        $stmt->execute([':id' => $idCita]);
    }
}


?>
