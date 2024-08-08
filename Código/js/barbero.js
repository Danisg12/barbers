$(document).ready(function() {
    $("#cerrar_sesion").click(function() {
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

    $.ajax({
        url: '../php/verificar_sesion.php',
        type: 'POST',
        dataType: 'json',
        success: function(response) {
            $("#user_name").text(response.nombre);
            if (response.success) {
                if (response.rol !== 'barbero') {
                    window.location.href = 'index.html';
                } else {
                    cargarCitas(response.id);
                }
            } else {
                window.location.href = 'index.html';
            }
        },
        error: function(error) {
            console.error('Error al verificar sesión:', error);
            window.location.href = 'index.html';
        }
    });

    function cargarCitas(barberoId) {
        $.ajax({
            url: '../php/citasbarbero.php',
            type: 'POST',
            data: {"barberoId": barberoId},
            dataType: 'json',
            success: function(response) {
                if (response.success && response.citas) {
                    $('#tablaCitas tbody').empty();

                    response.citas.forEach(function(cita) {
                        var fila = `<tr>
                                        <td>${cita.ID_cita}</td>
                                        <td>${cita.nombre_servicio}</td>
                                        <td>${cita.Fecha}</td>
                                        <td>${cita.Hora}</td>
                                    </tr>`;
                        $('#tablaCitas tbody').append(fila);
                    });
                } else {
                    console.error('Error al cargar citas:', response.message);
                }
            },
            error: function(error) {
                console.error('Error al cargar citas:', error);
            }
        });
    }

   

});
