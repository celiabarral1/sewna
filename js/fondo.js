
    // Version 1.1 23/10/2021 
    "use strict";
    class Fondo {

        constructor (nombre,capital,longitud,latitud,altitud){
            this.nombre=nombre;
            this.capital=capital;
            this.longitud=longitud;
            this.latitud=latitud;
            this.key="aad7ca09450193aae0a8389b8da399ad";
            //d34b52f700179f6b
        }

        getFoto(){
            var flickrAPI = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + this.key + "&lat=" + this.latitud + "&lon=" + this.longitud + "&format=json&jsoncallback=?";

            $.ajax({
                url: flickrAPI,
                method: 'GET',
                dataType: 'json',
                success: function(response) {
                  if (response.photos && response.photos.photo && response.photos.photo.length > 0) {
          
                        var backgroundimg= response.photos.photo[6];
                        var imageUrl = 'https://live.staticflickr.com/' + backgroundimg.server + '/' + backgroundimg.id + '_' + backgroundimg.secret+ '_b.jpg';
                        
                        $('body').css('background-image', 'url(' + imageUrl + ')');
                        $('body').css('background-size', 'cover');
                   
                  } else {
                    $('body').append('<p>No se encontraron imágenes para' + this.nombre + ' </p>');
                    
                  }
                },
                error: function(xhr, status, error) {
                  $('body').append('<p>Error al obtener las imágenes:' + error + ' </p>');
                 
                }
              });
    
        }

        
    }

    var fondo = new Fondo("Letonia", "Riga", "24.1058900", "56.9460000");

 
