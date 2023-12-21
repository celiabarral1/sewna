
    // Version 1.1 23/10/2021 
    "use strict";
    class Apis {

        constructor (){
          navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this), this.verErrores.bind(this));
          // Agregar event listener para manejar el cambio de pantalla completa

          this.isStreaming = false;
          this.handleFullscreenChange = this.handleFullscreenChange.bind(this);
          
          this.apiKey = 'pk.eyJ1IjoidW8yNzc1NzgiLCJhIjoiY2xxMnMzZGo5MDN5aDJrcXcwMm90dGxhbiJ9.jKqm3XjRWvZJLAF2Knym7A';
        }

       
        // // API CANVAS
        // loader()
        // {
        // var canvas = document.querySelector('canvas');
        // var canvas1 = canvas.getContext('2d');

        //   // Texto
        //   canvas1.font = 'italic 40px sans-serif';
        //   canvas1.strokeStyle = "rgba(200, 0, 0, 1)";
        //   canvas1.strokeText("¡Zona Streaming!", 20, 70);

        //     // Segundo corazón
        //     canvas1.fillStyle = "rgba(200, 0, 0, 0.5)";
        //     canvas1.beginPath();
        //     canvas1.moveTo(430, 35); // Moviendo un poco más arriba al segundo corazón
        //     canvas1.bezierCurveTo(430, 32, 425, 20, 405, 20);
        //     canvas1.bezierCurveTo(375, 20, 375, 57.5, 375, 57);
        //     canvas1.bezierCurveTo(375, 75, 395, 97, 430, 115);
        //     canvas1.bezierCurveTo(465, 97, 485, 75, 485, 57);
        //     canvas1.bezierCurveTo(485, 57.5, 485, 20, 455, 20);
        //     canvas1.bezierCurveTo(440, 20, 430, 32, 430, 35);
        //     canvas1.closePath();
        //     canvas1.fill();

        //     canvas1.beginPath();
        //     canvas1.arc(170,130, 20, 0, Math.PI * 2); // (x, y, radio, startAngle, endAngle)
        //     canvas1.fillStyle = 'gray'; // Color de relleno
        //     canvas1.fill();
        //     canvas1.beginPath();
        //     canvas1.arc(70,130, 30, 0, Math.PI * 2); // (x, y, radio, startAngle, endAngle)
        //     canvas1.fillStyle = "rgba(200, 0, 0, 0.5)";; // Color de relleno
        //     canvas1.fill();
        //     canvas1.beginPath();
        //     canvas1.arc(270,130, 30, 0, Math.PI * 2); // (x, y, radio, startAngle, endAngle)
        //     canvas1.fillStyle = "rgba(200, 0, 0, 0.5)";; // Color de relleno
        //     canvas1.fill();

        // }



        //API STREAMING
        

        loadVideo(){
         
          var stream_check = null;
         
          var self = this;
          

          navigator.mediaDevices.getUserMedia({ video: true })
          .then((stream) => {
            var video = document.querySelector('video');
            stream_check=stream;
            video.srcObject = stream;
            video.onloadedmetadata = function(e) {
              video.play();
              self.isStreaming=true;
              self.obtenerUbi();
              
            };
            
          })
          .catch(function(err) {
            alert('No ser pudo acceder a la cámara');
          });

            var stopButton = document.querySelector('button');
            stopButton.addEventListener('click', function() {

              if (self.isStreaming) {
                $('p').remove();
                var video = document.querySelector('video');
                var tracks = stream_check.getTracks();
                tracks.forEach(function(track) {
                  track.stop(); 
                });
                video.srcObject = null;
                self.isStreaming=false;
                
              }else{
                navigator.mediaDevices.getUserMedia({ video: true })
                  .then((stream) => {
                    var video = document.querySelector('video');
                    stream_check=stream;
                    video.srcObject = stream;
                    video.onloadedmetadata = function(e) {
                      video.play();
                      self.isStreaming=true;
                      self.obtenerUbi();
                    };
                  
                  if (video.requestFullscreen) {
                    video.requestFullscreen();
                  } 
                })
                  .catch(function(err) {
                    alert('No ser pudo acceder a la cámara');
                  });
              }
            });
            this.isStreaming=self.isStreaming;
        }

        // API GEO
        getPosicion(posicion){
          this.mensaje = "Se ha realizado correctamente la petición de geolocalización";
          this.longitud         = posicion.coords.longitude; 
          this.latitud          = posicion.coords.latitude;  
          this.precision        = posicion.coords.accuracy;
          this.altitud          = posicion.coords.altitude;
          this.precisionAltitud = posicion.coords.altitudeAccuracy;
          this.rumbo            = posicion.coords.heading;
          this.velocidad        = posicion.coords.speed;       
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
      obtenerUbi(){
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.longitud},${this.latitud}.json?access_token=${this.apiKey}`;

        fetch(url)
          .then(response => response.json())
          .then(data => {
            if (data.features && data.features.length > 0) {
              var p = document.createElement('p');
              p.textContent = 'Retransmitiendo en directo desde ' + data.features[0].place_name;
              $('video').after(p);
            } else {
              alert('No se pudo obtener la ubicación.');
            }
          })
          .catch(error => {
            alert('Error al obtener la ubicación');
          });
      }
      handleFullscreenChange() {
        if (!document.fullscreenElement) {
          alert("Sería recomendable tener pantalla completa para retransmitir");
        }
      }

      addEventFullScreen(){
        document.addEventListener('fullscreenchange', this.handleFullscreenChange);
      }      
      
    }

    

 var apis = new Apis();
