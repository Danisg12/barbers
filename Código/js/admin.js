$(document).ready(function() {
    // Verificar sesión al cargar la página
    $.ajax({
        url: '../php/verificar_sesion.php',
        type: 'POST',
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                $("#user_name").text(response.nombre);
                cargarUsuarios();
                cargarCitas();
                $user_id = response.id;
            } else {
                window.location.href = 'index.html';
            }
        },
        error: function(e) {
            console.error('Error al verificar sesión:', e);
            window.location.href = 'index.html';
        }
    });

    // Cerrar sesión
    $("#logout").click(function() {
        $.ajax({
            url: '../php/cerrar_sesion.php',
            type: 'POST',
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    window.location.href = 'index.html';
                } else {
                    console.error('Error al cerrar sesión:', response.message);
                }
            },
            error: function(e) {
                console.error('Error al cerrar sesión:', e);
            }
        });
    });

    // Registrar usuario
    $("#btn_registrar").click(function(){
        var usuario = $("#nombre_usuario").val();
        var contrasena = $("#contrasena").val();
        var nombre = $("#nombre").val();
        var correo = $("#correo").val();
        var telefono = $("#telefono").val();
        
    
        if(usuario !== '' && contrasena !== '' && nombre !== '' && correo !== '' && telefono !== '' ){
            $.ajax({
                url: '../php/registrar_usuario.php', 
                type: 'post',
                data: {
                    "usuario": usuario,
                    "contrasena": contrasena,
                    "nombre": nombre,
                    "correo": correo,
                    "telefono": telefono,
                    "rol": "barbero",
                    "nocache": Math.random()
                },
                dataType: 'json', 
                success: function(response){
                    console.log("Respuesta del servidor:", response);
                    if(response.success){ 
                        alert("Registro exitoso");
                        resetFormulario();
                        cargarUsuarios();
                    } else {
                        alert("Error: " + response.message);
                    }
                },
                error: function(e) {
                    console.error('Error al registrar usuario:', e);
                }
            });
        } else {
            alert("Por favor, complete todos los campos");
        }
    });

    // Actualizar usuario
    $("#btn_actualizar").click(function() {
        var idUsuario = $(this).attr('data-id');
        var usuario = $("#nombre_usuario").val();
        var contrasena = $("#contrasena").val();
        var nombre = $("#nombre").val();
        var correo = $("#correo").val();
        var telefono = $("#telefono").val();
        var rol = $("#rol").val();

        if (usuario !== '' && nombre !== '' && correo !== '' && telefono !== '') {
            $.ajax({
                url: '../php/actualizar_usuario.php',
                type: 'post',
                data: {
                    "id": idUsuario,
                    "usuario": usuario,
                    "contrasena": contrasena,
                    "nombre": nombre,
                    "correo": correo,
                    "telefono": telefono,
                    "nocache": Math.random()
                },
                dataType: 'json',
                success: function(response) {
                    console.log("Respuesta del servidor:", response);
                    if (response.success) {
                        alert("Actualización exitosa");
                        resetFormulario();
                        cargarUsuarios();
                    } else {
                        alert("Error: " + response.message);
                    }
                },
                error: function(e) {
                    console.error('Error al actualizar usuario:', e);
                }
            });
        } else {
            alert("Por favor, complete todos los campos");
        }
    });
});

function cargarUsuarios() {
    $.ajax({
        url: '../php/admin.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.success && response.usuario) {
                $('#tablaUsuarios tbody').empty();

                response.usuario.forEach(function(usuario) {
                    var fila = "<tr>" +
                    "<td>" + usuario.ID_usuario + "</td>" +
                    "<td>" + usuario.Usuario + "</td>" +
                    "<td>" + usuario.Nombre + "</td>" +
                    "<td>" + usuario.Correo_electronico + "</td>" +
                    "<td>" + usuario.Telefono + "</td>" +
                    "<td>" + usuario.Rol + "</td>" +
                    "<td>" +
                    "<button onclick='editarUsuario(" + usuario.ID_usuario + ")'>Editar</button>" +
                    "<button onclick='eliminarUsuario(" + usuario.ID_usuario + ")'>Eliminar</button>" +
                    "</td>" +
                    "</tr>";

                    $('#tablaUsuarios tbody').append(fila);
                });
            } else {
                console.error('Error al cargar usuarios:', response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error al cargar usuarios:', error);
        }
    });
}

function cargarCitas() {
    $.ajax({
        url: '../php/citas.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.success && response.citas) {
                $('#tablaCitas tbody').empty();

                response.citas.forEach(function(cita) {
                    var fila = "<tr>" +
                    "<td>" + cita.ID_cita + "</td>" +
                    "<td>" + cita.ID_cliente + "</td>" +
                    "<td>" + cita.ID_barbero + "</td>" +
                    "<td>" + cita.ID_servicio + "</td>" +
                    "<td>" + cita.Fecha + "</td>" +
                    "<td>" + cita.Hora + "</td>" +
                    "<td>" +
                    "<button onclick='eliminarCita(" + cita.ID_cita + ")'>Eliminar</button>" +
                    "</td>" +
                    "</tr>";
                
                    $('#tablaCitas tbody').append(fila);
                });
            } else {
                console.error('Error al cargar citas:', response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error al cargar citas:', error);
        }
    });
}

function editarUsuario(id) {
    $.ajax({
        url: '../php/admin.php',
        type: 'GET',
        dataType: 'json',
        data: { id: id },
        success: function(response) {
            if (response.success && response.usuario) {
                var usuario = response.usuario.find(u => u.ID_usuario == id);

                $("#nombre_usuario").val(usuario.Usuario);
                $("#contrasena").val(''); 
                $("#nombre").val(usuario.Nombre);
                $("#correo").val(usuario.Correo_electronico);
                $("#telefono").val(usuario.Telefono);
               

                $("#btn_registrar").hide();
                $("#btn_actualizar").show().attr('data-id', usuario.ID_usuario);
            } else {
                console.error('Error al cargar datos del usuario:', response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error al cargar datos del usuario:', error);
        }
    });
}


function resetFormulario() {
    // Restablece los campos del formulario
    $("#nombre_usuario").val('');
    $("#contrasena").val('');
    $("#nombre").val('');
    $("#correo").val('');
    $("#telefono").val('');
    $("#rol").val('');

    // Muestra el botón de registro y oculta el botón de actualización
    $("#btn_registrar").show();
    $("#btn_actualizar").hide();
}

function eliminarUsuario(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
        $.ajax({
            url: '../php/admin.php',
            type: 'POST',
            dataType: 'json',
            data: {
                action: 'eliminar',
                id: id
            },
            success: function(response) {
                if (response.success) {
                    cargarUsuarios();
                    alert(response.message);
                } else {
                    console.error('Error al eliminar usuario:', response.message);
                }
            },
            error: function(error) {
                console.error('Error al eliminar usuario:', error);
            }
        });
    }
}

function eliminarCita(id) {
    if (confirm("¿Estás seguro de que deseas eliminar esta cita?")) {
        $.ajax({
            url: '../php/citas.php',
            type: 'POST',
            dataType: 'json',
            data: {
                action: 'eliminar',
                id: id
            },
            success: function(response) {
                if (response.success) {
                    cargarCitas();
                    alert(response.message);
                } else {
                    console.error('Error al eliminar cita:', response.message);
                }
            },
            error: function(error) {
                console.error('Error al eliminar cita:', error);
            }
        });
    }
}
