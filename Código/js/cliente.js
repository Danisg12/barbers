$(document).ready(function() {
    const timeSelect = $('#hora');
    function rellenarhoras(horas) {
        console.log("Poblando horas disponibles:", horas); 
        timeSelect.empty();
        if (horas.length === 0) {
            const option = $('<option></option>').text('No hay horas disponibles');
            timeSelect.append(option);
        } else {
            horas.forEach(hora => {
                const option = $('<option></option>').val(hora).text(hora);
                timeSelect.append(option);
            });
        }
    }
    function actualizarHoras() {
        var fecha = $('#fecha').val();
        var barbero = $('#barbero').val();
        if (!fecha) return;

        console.log("Fecha seleccionada:", fecha); 
        $.ajax({
            type: 'POST',
            url: '../php/citasdisponibles.php',
            data: { Fecha: fecha, Barbero: barbero },
            dataType: 'json',
            success: function(horas) {
                if (horas.error) {
                    console.error("Error del servidor:", horas.error);
                    return;
                }
                console.log("Horas disponibles recibidas:", horas); 
                rellenarhoras(horas);
            },
            error: function(e) {
                console.error("Error en la solicitud AJAX:", e);
            }
        });
    }

    const calendar = $('#calendar');
    const form = $('#appointmentForm');
    function updateCalendar(month, year) {
        calendar.empty();
    
        const weekdays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const totalDays = lastDayOfMonth.getDate();
        const firstDayOfWeek = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1;
    
        let table = $('<table class="calendar-table"></table>');
    
        let dayNamesRow = $('<tr class="weekdays"></tr>');
        for (let i = 0; i < 5; i++) {
            const dayNameCell = $('<th></th>').text(weekdays[i]);
            dayNamesRow.append(dayNameCell);
        }
        table.append(dayNamesRow);
    
        let currentRow = $('<tr></tr>');
        table.append(currentRow);
  
        if (firstDayOfWeek !== 0) {
            for (let i = 0; i < firstDayOfWeek; i++) {
                currentRow.append('<td class="empty-day"></td>');
            }
        }     
        for (let day = 1; day <= totalDays; day++) {
            const currentDayOfWeek = new Date(year, month, day).getDay();
    
            if (currentDayOfWeek === 1 && day !== 1) { 
                currentRow = $('<tr></tr>');
                table.append(currentRow);
            }
    
            if (currentDayOfWeek >= 1 && currentDayOfWeek <= 5) { 
                
                const currentDayCell = $('<td class="dias_semana"></td>').text(day);
                const today = new Date();
    
                if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                    currentDayCell.addClass('hoy');
                }
    
                currentDayCell.click(function() {
                    $('#fecha').val(`${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`);
                    actualizarHoras();
                });
    
                currentRow.append(currentDayCell);
            }
    
            if (currentDayOfWeek === 0 || day === totalDays) { 
                const remainingDays = 5 - currentRow.children().length;
                for (let i = 0; i < remainingDays; i++) {
                    currentRow.append('<td class="empty-day"></td>');
                }
            }
        }
    
        calendar.append(table);
    }
    $.ajax({
        url: '../php/verificar_sesion.php',
        type: 'POST',
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                $("#user_name").text(response.nombre);
                loadBarberos();
                cargarServicios();
                bindEvents(response.id);
                cargarcitas(response.id);
                $user_id= response.id;
                const currentDate = new Date();
                updateCalendar(currentDate.getMonth(), currentDate.getFullYear());
                
           
            } else {
                window.location.href = 'index.html';
            }
        },
        error: function(e) {
            console.error('Error al verificar sesión:', e);
            window.location.href = 'index.html';
        }
    });
   
    function bindEvents(userId) {
        $("#barbero").change(actualizarHoras);
        
    
      
      
        
        const monthSelect = $('#mes');
        const yearSelect = $('#año');
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();

        for (let month = 0; month < 12; month++) {
            const option = $('<option></option>').val(month).text(new Date(2024, month, 1).toLocaleString('es-ES', { month: 'long' }));
            monthSelect.append(option);
        }

        for (let year = currentYear; year <= currentYear + 5; year++) {
            const option = $('<option></option>').val(year).text(year);
            yearSelect.append(option);
        }

        monthSelect.val(currentMonth);
        yearSelect.val(currentYear);

        monthSelect.change(function() {
            updateCalendar(parseInt($(this).val()), parseInt(yearSelect.val()));
        });

        yearSelect.change(function() {
            updateCalendar(parseInt(monthSelect.val()), parseInt($(this).val()));
        });

       
       

        form.submit(function(event) {
            event.preventDefault();
            const fecha = $('#fecha').val();
            const hora = $('#hora').val();
            const servicio = $('#servicio').val();
            const barbero = $('#barbero').val();
            insertCita(fecha, hora, servicio, barbero, userId);
        });
        
        function insertCita(fecha, hora, servicio, barbero, usuario) {
            return $.ajax({
                type: 'POST',
                url: '../php/insertarCita.php',  
                data: {
                    Cliente: usuario,
                    Fecha: fecha,
                    Hora: hora,
                    Servicio: servicio,
                    ID_barbero: barbero,
                },
                dataType: 'json',
                success: function(response) {
                    console.log("Respuesta al insertar cita:", response);
                    if (response.success) {
                        alert(response.message);
                        cargarcitas(usuario); 
                    } else {
                        console.error("Error al insertar cita:", response.message);
                    }
                    window.location.reload();
                },
                error: function(e) {
                    console.error("Error al insertar cita:", e);
                }
            });
        }
        

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
    }

    function loadBarberos() {
        $.ajax({
            type: 'GET',
            url: '../php/obtenerbarberos.php',
            dataType: 'json',
            success: function(data) {
                const barberoSelect = $('#barbero');
                data.forEach(barbero => {
                    const option = $('<option></option>').val(barbero.Id).text(barbero.Nombre);
                    barberoSelect.append(option);
                });
            },
            error: function(e) {
                console.error("Error al cargar barberos:", e);
            }
        });
    }

    function cargarServicios() {
        $.ajax({
            type: 'GET',
            url: '../php/obtenerservicios.php',
            dataType: 'json',
            success: function(data) {
                const servicioSelect = $('#servicio');
                data.forEach(servicio => {
                    const option = $('<option></option>').val(servicio.Id).text(servicio.Nombre);
                    servicioSelect.append(option);
                });
            },
            error: function(e) {
                console.error("Error al cargar servicios:", e);
            }
        });
    }
    $(document).on('click', 'td', function(event) {
        $("td").removeClass("click");
        $(event.target).addClass("click"); 
      
    });
    
});
   
    
   
    function cargarcitas(clienteId) {
        $.ajax({
            url: '../php/citascliente.php',
            type: 'POST',
            data: {"clienteId": clienteId},
            dataType: 'json',
            success: function(response) {
                if (response.success && response.citas) {
                    $('#tablaCitas tbody').empty();
    
                    response.citas.forEach(function(cita) {
                        var fila = "<tr>" +
                        "<th id='citas'>" + cita.nombre_servicio + "</th>" +
                        "<th id='citas'>" + cita.Fecha + "</th>" +
                        "<th id='citas'>" + cita.Hora + "</th>" +
                        "<th id='citas'style='cursor: pointer;' onclick='eliminarCita(" + cita.ID_cita + ")'>Eliminar</th>" +
                        "</tr>";
                    
                    
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
                       
                        alert(response.message);
                        cargarcitas($user_id);
                    } else {
                        console.error('Error al eliminar cita:', response.message);
                    }
                },
                error: function(xhr, status, error) {
                    console.error('Error al eliminar cita:', error);
                }
            });
        }
    }
    


