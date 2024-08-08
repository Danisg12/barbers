<?php
    class Conexion {
        private $_conn = NULL;
        public function __construct() {
        
        }
    
        public function conectar() {
            try {
                $this ->_conn = new PDO("mysql:host=localhost;dbname=barbers","root","");
           // echo "conectado";
            } catch (PDOException $e){
                echo "Error ".$e->getMessage();
            }
            return $this->_conn;
        }
        
    }
//$con = new Conexion();
//$con->conectar();
?>