$(document).ready(function() {
   
    $.ajax({
        url: '../php/verificar_sesion.php',
        type: 'POST',
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                $("#user_name").text(response.nombre);
                cargarUsuarios();
                cargarCitas();
                $user_id= response.id;
            } else {
                window.location.href = 'index.html';
            }
        },
        error: function(e) {
            console.error('Error al verificar sesión:', e);
            window.location.href = 'index.html';
        }
    });
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
