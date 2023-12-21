
    // Version 1.1 23/10/2021 
    "use strict";
    class Viajes {
      constructor (){
        navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this), this.verErrores.bind(this));
        this.apiKey = 'pk.eyJ1IjoidW8yNzc1NzgiLCJhIjoiY2xxMnMzZGo5MDN5aDJrcXcwMm90dGxhbiJ9.jKqm3XjRWvZJLAF2Knym7A';
    }
    getPosicion(posicion){
        this.mensaje = "Se ha realizado correctamente la petición de geolocalización";
        this.longitud         = posicion.coords.longitude; 
        this.latitud          = posicion.coords.latitude;  
        this.precision        = posicion.coords.accuracy;
        this.altitud          = posicion.coords.altitude;
        this.precisionAltitud = posicion.coords.altitudeAccuracy;
        this.rumbo            = posicion.coords.heading;
        this.velocidad        = posicion.coords.speed;       
        this.getMapaEstaticoMapbox();
        this.getMapaDinamicoMapox();
    }
    verErrores(error){
        switch(error.code) {
        case error.PERMISSION_DENIED:
            this.mensaje = "El usuario no permite la petición de geolocalización"
            break;
        case error.POSITION_UNAVAILABLE:
            this.mensaje = "Información de geolocalización no disponible"
            break;
        case error.TIMEOUT:
            this.mensaje = "La petición de geolocalización ha caducado"
            break;
        case error.UNKNOWN_ERROR:
            this.mensaje = "Se ha producido un error desconocido"
            break;
        }
    }

    verTodo(dondeVerlo){
      var ubicacion=document.getElementById(dondeVerlo);
      var datos='<p>'+ this.mensaje + '</p>'; 
      datos+='<p>Longitud: '+this.longitud +' grados</p>'; 
      datos+='<p>Latitud: '+this.latitud +' grados</p>';
      datos+='<p>Precisión de la longitud y latitud: '+ this.precision +' metros</p>';
      datos+='<p>Altitud: '+ this.altitude +' metros</p>';
      datos+='<p>Precisión de la altitud: '+ this.precisionAltitud +' metros</p>'; 
      datos+='<p>Rumbo: '+ this.rumbo +' grados</p>'; 
      datos+='<p>Velocidad: '+ this.velocidad +' metros/segundo</p>';
      ubicacion.innerHTML = datos;
  }

  getMapaEstaticoMapbox() {
    const imagenMapa = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${this.longitud},${this.latitud},15,0/800x600?access_token=${this.apiKey}`;
    
    const imagen = document.createElement('img');
    imagen.src = imagenMapa;
    imagen.alt = 'Mapa estático Mapbox';

    document.querySelector('main > section:first-child').appendChild(imagen);

    
}
      
  getMapaDinamicoMapox(){
    mapboxgl.accessToken = this.apiKey;

    var map = new mapboxgl.Map({ 
      container: document.querySelector('main > article'), 
      style: 'mapbox://styles/mapbox/streets-v9',  
      center: [this.longitud, this.latitud],  
      zoom: 13
    }); 

    new mapboxgl.Marker()
        .setLngLat([this.longitud, this.latitud])
        .addTo(map);

    map.addControl(new mapboxgl.NavigationControl());


    }


    readInputFile(files){
      //Solamente toma un archivo
      var archivo = files[0];
      var tipoXml = /xml.*/;
      
      if(!archivo.type.match(tipoXml)){
        var contenido = $('<p>').text("El formato debe ser XML. ");
        $('body> section:nth-child(4)').append(contenido);

      }else{
        var nombre = $('<h4>').text("Nombre del archivo: " + archivo.name);
        $('body> section:nth-child(4)').append(nombre);
  
        var lista = $('<ul>'); 
        var tamaño = $('<li>').text('Tamaño del archivo: ' + archivo.size + ' bytes'); 
        var tipo = $('<li>').text('Tipo del archivo: ' + archivo.type); 
        var ultima = $('<li>').text('Fecha de la última modificación: ' + archivo.lastModifiedDate);
        lista.append(tamaño); 
        lista.append(tipo); 
        lista.append(ultima);
        $('body> section:nth-child(4)').append(lista);
        
        var contenido = $('<p>').text("Contenido del texto: ");
        $('body> section:nth-child(4)').append(contenido);
        var lector = new FileReader();
        lector.onload = function (evento) {
            var contenido = lector.result;
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(contenido, "text/xml");

            var rutas = xmlDoc.getElementsByTagName('ruta');
            
            for(let i =0;i<rutas.length;i++){
              var nombre = rutas[i].getAttribute('nombre');
              var tipo = rutas[i].getAttribute('tipo');
              var fechaInicio = rutas[i].querySelector('fechaInicio').textContent;
              var horaInicio = rutas[i].querySelector('horaInicio').textContent;
              var duracion = rutas[i].querySelector('duracion').textContent;
              var agencia = rutas[i].querySelector('agencia').textContent;
              var descripcion = rutas[i].querySelector('descripcion').textContent;
              var personas = rutas[i].querySelector('personas').textContent;
              var lugarInicio = rutas[i].querySelector('lugarInicio').textContent;
              var direccionInicio = rutas[i].querySelector('direccionInicio').textContent;
              var coor_ruta = rutas[i].querySelector('coordenadas');
              var long_ruta= coor_ruta.querySelector('longitud').textContent;
              var lat_ruta = coor_ruta.querySelector('latitud').textContent;
              var alt_ruta = coor_ruta.querySelector('altitud').textContent;
              var recomendacion = rutas[i].querySelector('recomendacion').textContent;
              var referencias = rutas[i].querySelectorAll('referencia');
              var refs = [];
              for (let j = 0; j < referencias.length; j++) {
                refs.push(referencias[j].textContent);
              }
              
              var info_ruta = `<section>
              <h2>${nombre}</h2>
              <p>${descripcion}</p>
              <ul>
              <li>Tipo: ${tipo}</li>
              <li>Fecha de inicio: ${fechaInicio}</li>
              <li>Hora de inicio: ${horaInicio}</li>
              <li>Duracion:  ${duracion}</li>
              <li>Agencia:  ${agencia}</li>
              <li>Duracion:  ${duracion}</li>
              <li>Recomenadado para:  ${personas}</li>
              <li>Punto de partida:  ${lugarInicio}. La dirección exacta es ${direccionInicio}</li>
              <li>Coordenadas punto de partida:
                <ul>
                <li>Longitud: ${long_ruta}</li>
                <li>Latitud: ${lat_ruta}</li>
                <li>Altitud: ${alt_ruta}</li>
                </ul>
              </li>
              </ul>
              <p>Algunos de los puntos o hitos destacables de esta ruta son: </p> 
              <ol>`;

              var hitos= rutas[i].getElementsByTagName('hito');
              for(let j=0;j<hitos.length;j++){
                var nombre_h= hitos[j].getAttribute('nombre');
                console.log(hitos[j].getAttribute('nombre'));
                var descripcion_h = hitos[j].querySelector('descripcion').textContent;
                var coor_h = hitos[j].querySelector('coordenadas');
                var long_h= coor_h.querySelector('longitud').textContent;
                var lat_h = coor_h.querySelector('latitud').textContent;
                var alt_h = coor_h.querySelector('altitud').textContent;
                var distancia = hitos[j].querySelector('distancia').textContent;
                var unidades = hitos[j].querySelector('distancia').getAttribute('unidades');
                var fotos =  hitos[i].querySelectorAll('foto');
                console.log(fotos);
                var videos =  hitos[i].querySelectorAll('video');
                
                var info_hito=`
                <li>${nombre_h}
                  <ul>
                    <li>Longitud: ${long_h}</li>
                    <li>Latitud: ${lat_h}</li>
                    <li>Altitud: ${alt_h}</li>
                    <li>Distancia: ${distancia} ${unidades}</li>
                  </ul>
              `;

                for (let k = 0; k < fotos.length; k++) {
                  console.log(fotos);
                  var src = fotos[k].textContent;
                  info_hito+=`<img src=${src} alt=foto_hito${k}></img>`;
                }

                // for (let k = 0; k < videos.length; k++) {
                //   var src = videos[k].textContent;
                //   info_hito+=`<video src=${src} alt=video_hito${k}></video>`;
                // }

                info_hito+=`</li>`;
                info_ruta += info_hito;
              }
              info_ruta+=` </ol><p>Recomendación: ${recomendacion}/10.</p><p> Si queréis más información consultad: `;
              for (let k = 0; k < refs.length; k++) {
                info_ruta += `<a href="${refs[k]}">${refs[k]}</a> , `;
              }

              info_ruta+=` </p></section>`;
              $('body> section:nth-child(4)').append(info_ruta);

            }

          }  
        lector.readAsText(archivo);
            
      }
  }

  async leerArchivo(file) {
    return new Promise((resolve, reject) => {
      var puntos = [];
      var lector = new FileReader();
      var nombre = $('<h4>').text("Nombre del archivo: " + file.name);
      $('body > section:nth-child(5)').append(nombre);
  
      lector.onload = function (evento) {
        var contenido = lector.result;
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(contenido, "text/xml");
        var placemarks = xmlDoc.getElementsByTagName('Placemark');
  
        for (let i = 0; i < placemarks.length; i++) {
          var p = placemarks[i];
          var nombre = p.querySelector('name');
          var point = p.querySelector('Point');
          var coordenadas_archivo = point.querySelector('coordinates').textContent.trim().split(',');
          var longitud = coordenadas_archivo[0];
          var latitud = coordenadas_archivo[1];
  
          puntos.push({
            nombre: nombre.textContent.trim(),
            coordenadas: [parseFloat(longitud), parseFloat(latitud)]
          });
        }
        resolve(puntos);
      };
  
      lector.readAsText(file);
    });
  }
  
  async readInputFileKml(files) {
    const tipoKml = /kml.*/;
    const puntosTotales = [];
  
    for (const file of files) {
      const puntos = await this.leerArchivo(file);
      puntosTotales.push(...puntos);
    }
  
      mapboxgl.accessToken ='pk.eyJ1IjoidW8yNzc1NzgiLCJhIjoiY2xxMnMzZGo5MDN5aDJrcXcwMm90dGxhbiJ9.jKqm3XjRWvZJLAF2Knym7A';
      const fifthSection = document.querySelector('body > section:nth-child(5)');
      const mapSection = document.createElement('section');

      fifthSection.append(mapSection);
      /* La creación dinámica de mapas provoca los siguientes warnings:
      Possible misuse of aria-label. (If you disagree with this warning, file an issue report or send e-mail to www-validator@w3.org.)
      Warning: Section lacks heading. Consider using h2-h6 elements to add identifying headings to all sections, or else use a div element instead for any cases where no heading is needed.
      Warning: Section lacks heading. Consider using h2-h6 elements to add identifying headings to all sections, or else use a div element instead for any cases where no heading is needed.*/

    var map = new mapboxgl.Map({ 
      container: mapSection, 
      style: 'mapbox://styles/mapbox/streets-v9',  
      center: [puntosTotales[0].coordenadas[0], puntosTotales[0].coordenadas[1]],  
      zoom: 7
    }); 

    puntosTotales.forEach(punto => {
      new mapboxgl.Marker()
          .setLngLat(punto.coordenadas)
          .setPopup(new mapboxgl.Popup().setHTML(`<h3>${punto.nombre}</h3>`))
          .addTo(map);
  });

  map.addControl(new mapboxgl.NavigationControl());
 
  }
  async leerSvg(file) {
    return new Promise((resolve, reject) => {
      var lector = new FileReader();
      var nombre = $('<h4>').text("Nombre del archivo: " + file.name);
      $('body > section:nth-child(6)').append(nombre);
  
      lector.onload = function (evento) {
        var contenido = lector.result;
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(contenido, "text/xml");
        var svg = xmlDoc.getElementsByTagName('svg');
  
        resolve(svg);
      };
  
      lector.readAsText(file);
    });
  }

  async readInputFileSvg(files){
    for (const file of files) {
      const svgs = await this.leerSvg(file);
      for (const svg of svgs) {
        $('body > section:nth-child(6)').append(svg);
      }
    }
}

gestionarCarrusel(){

  const slides = document.querySelectorAll("img");
  

// select next slide button
const nextSlide = document.querySelector("button[data-action='next']");

// current slide counter
let curSlide = 3;
// maximum number of slides
let maxSlide = slides.length - 1;

// add event listener and navigation functionality
nextSlide.addEventListener("click", function () {
  // check if current slide is the last and reset current slide
  if (curSlide === maxSlide) {
    curSlide = 0;
  } else {
    curSlide++;
  }

  //   move slide by -100%
  slides.forEach((slide, indx) => {
  	var trans = 100 * (indx - curSlide);
    $(slide).css('transform', 'translateX(' + trans + '%)')
  });
});

// select next slide button
const prevSlide = document.querySelector("button[data-action='prev']");

// add event listener and navigation functionality
prevSlide.addEventListener("click", function () {
  // check if current slide is the first and reset current slide to last
  if (curSlide === 0) {
    curSlide = maxSlide;
  } else {
    curSlide--;
  }

  //   move slide by 100%
  slides.forEach((slide, indx) => {
  	var trans = 100 * (indx - curSlide);
    $(slide).css('transform', 'translateX(' + trans + '%)')
  });
});
}
  
  
}
var viajes = new Viajes();


    

 
