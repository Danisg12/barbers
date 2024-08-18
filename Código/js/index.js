$(document).ready(function(){
    $("#chk_registro").change(function(){
        if(this.checked) {
            $("#registro_fields").slideDown();
            $("#btn_iniciar").hide();
            $("#btn_registrar").show();
            $("form.registro").css("max-height", "1000px");
        } else {
            $("#registro_fields").slideUp();
            $("#btn_iniciar").show();
            $("#btn_registrar").hide();
            $("form.registro").css("max-height", "300px");
        }
    });

    $("#rol").change(function() {
        if($(this).val() === "barbero") {
            $("#contrasena_barbero").slideDown();
        } else {
            $("#contrasena_barbero").slideUp();
        }
    });

    $("#btn_iniciar").click(function(){
        var usuario = $("#nombre_usuario").val();
        var contrasena = $("#contrasena").val();

        if(usuario !== '' && contrasena !== ''){
            $.ajax({
                url: '../php/buscar_usuario.php', 
                type: 'post',
                data: {"usuario": usuario, "contrasena": contrasena, "nocache": Math.random()},
                dataType: 'json', 
                success: function(response){
                    console.log("Respuesta del servidor:", response);
                    if(response.success){ 
                        localStorage.setItem('usuario', JSON.stringify(response));
                        if(response.rol === "barbero") {
                            window.location.href = "../html/barbero.html";
                        } else if (response.rol === "cliente") {
                            window.location.href = "../html/cliente.html";
                        } else if (response.rol === "administrador") {
                            window.location.href = "../html/admin.html";
                        } else {
                            window.alert("Rol de usuario no reconocido");
                        }
                    } else {
                        window.alert("Error: " + response.message);
                    }
                },
            });
        } else {
            window.alert("Por favor, complete todos los campos");
        }
    });

    $("#btn_registrar").click(function(){
        var usuario = $("#nombre_usuario").val();
        var contrasena = $("#contrasena").val();
        var nombre = $("#nombre").val();
        var correo = $("#correo").val();
        var telefono = $("#telefono").val();
        var rol = $("#rol").val();
        var contrasenaBarbero = $("#id_contrasena_barbero").val();

        if(usuario !== '' && contrasena !== '' && nombre !== '' && correo !== '' && telefono !== '' && rol !== ''){
            if(rol === "barbero" && contrasenaBarbero !== "aklopsd") {
                window.alert("La contraseña del barbero es incorrecta. Por favor, ingresa la contraseña que te proporcione el admin.");
            } else {
                $.ajax({
                    url: '../php/registrar_usuario.php', 
                    type: 'post',
                    data: {"usuario": usuario, "contrasena": contrasena, "nombre": nombre, "correo": correo, "telefono": telefono, "rol": "cliente", "nocache": Math.random()},
                    dataType: 'json', 
                    success: function(response){
                        console.log("Respuesta del servidor:", response);
                        if(response.success){ 
                            window.alert("Registro exitoso");
                            $("#nombre_usuario").val("");
                            $("#contrasena").val("");
                            $("#nombre").val("");
                            $("#correo").val("");
                            $("#telefono").val("");
                            $("#registro_fields").hide();
                            $("#btn_iniciar").show();
                            $("#btn_registrar").hide();
                            $("#chk_registro").prop("checked", false);
                            $("form.registro").css("max-height", "300px");
                        } else {
                            window.alert("Error: " + response.message);
                        }
                    },
                });
            }
        } else {
            window.alert("Por favor, complete todos los campos");
        }
    });
});
