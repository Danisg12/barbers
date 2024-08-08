$(document).ready(function() {
   
var resultado = document.getElementById("id_resultado");


    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (objPosition) {
            var map = L.map('map').setView([40.93338,-4.10010], 17);

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);
           
            L.marker([40.93338,-4.10010]).addTo(map)
                .bindPopup('Daniels barber')
                .openPopup();
        },

            function (objPositionError) {
                switch (objPositionError.code) {
                    case objPositionError.PERMISSION_DENIED:
                        resultado.innerHTML = "No se ha permitido el acceso a la posición del usuario";
                        break;
                    case objPositionError.POSITION_UNAVAILABLE:
                        resultado.innerHTML = "No se ha podido acceder a la información de su posición";
                        break;
                    case objPositionError.TIMEOUT:
                        resultado.innerHTML = "El servicio ha tardado demasiado tiempo en responder";
                        break;
                    default:
                        resultado.innerHTML = "Error desconocido";
                }
            },
            {
                maxinumAge: 75000,
                timeout: 15000
            })
    } else {
        resultado.innerHTML = "Su navegador no soporta la API de geolocalización";
    }
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);})