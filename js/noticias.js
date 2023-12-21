
    // Version 1.1 23/10/2021 
    "use strict";
    class Noticias {

        constructor (){
          if (window.File && window.FileReader && window.FileList && window.Blob) 
          {  
              //El navegador soporta el API File
              document.write("<p>Este navegador soporta el API File </p>");
          }
              else document.write("<p>¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!</p>");
        }

       
      readInputFile(files){
      //Solamente toma un archivo
      var archivo = files[0];
      var nombre = $('<h4>').text("Nombre del archivo: " + archivo.name);
      $('section').append(nombre);


      var lista = $('<ul>'); 
      var tamaño = $('<li>').text('Tamaño del archivo: ' + archivo.size + ' bytes'); 
      var tipo = $('<li>').text('Tipo del archivo: ' + archivo.type); 
      var ultima = $('<li>').text('Fecha de la última modificación: ' + archivo.lastModifiedDate);
      lista.append(tamaño); 
      lista.append(tipo); 
      lista.append(ultima);
      $('section').append(lista);
      
      var contenido = $('<p>').text("Contenido del texto: ");
      $('section').append(contenido);

      //Solamente admite archivos de tipo texto
      var tipoTexto = /text.*/;
      if (archivo.type.match(tipoTexto)) 
        {
          var lector = new FileReader();
          lector.onload = function (evento) {
            //El evento "onload" se lleva a cabo cada vez que se completa con éxito una operación de lectura
            //La propiedad "result" es donde se almacena el contenido del archivo
            //Esta propiedad solamente es válida cuando se termina la operación de lectura
            var contenido = lector.result.split('\n');
            contenido.forEach((noticia) => {
              var l = noticia.split('_');
              for(let i = 0 ; i<4;i++){
                if (i === 0) {
                  var titular = $('<h4>').text(l[i]);
                  $('section').append(titular);
              } else if (i === 1) {
                  var entradilla = $('<h5>').text(l[i]);
                  $('section').append(entradilla);
              } else if(i===2){
                  var contenido = $('<p>').text(l[i]);
                  $('section').append(contenido);
              } else{
                  var autor = $('<p>').text("Noticia estrita por: " + l[i]);
                  $('section').append(autor);
              }
              }
              
            });
            }      
          lector.readAsText(archivo);
          }
      else {
           var p_error = $('<p>').text("No se puco abrir el archivo");
           $('section').append(autor);
          }     
          
      this.añadirForm();
  }

  añadirForm(){
    var form = 
    '<h3>Introduce una nueva noticia</h3><form name="noticia">' +
        '<p><label for="titular"> Titular:  </label> <input id="titular" type="text" placeholder="Escriba el titular" required=""> </p>' +
        '<p><label for="entradilla"> Entradilla:  </label> <input id="entradilla" type="text" placeholder="Escriba la entradilla" required=""> </p>' +
        '<p><label for="contenido"> Contenido:  </label> <input id="contenido" type="text" placeholder="Escriba el contenido" required=""> </p>' +
        '<p><label for="autor">Autor/a: </label><input id="autor" type="text" placeholder="Escriba el contenido" required=""> </p>' +
        '<p><input type="submit" value="Añadir noticia"></p>' +
    '</form>';
    $('body').append(form);

    $('form[name="noticia"]').on('submit', function(event) {
      event.preventDefault(); 

      var inputs = $(this).find('input[type="text"]'); 

      var values = [];
      inputs.each(function() {
          values.push($(this).val());
      });


      var nuevaNoticia = $('<section>');
      nuevaNoticia.append('<h4>' + values[0] + '</h4>');
      nuevaNoticia.append('<h5>' + values[1] + '</h5>');
      nuevaNoticia.append('<p>' + values[2] + '</p>');
      nuevaNoticia.append('<p>Autor: ' + values[3] + '</p>');

      $('section').append(nuevaNoticia);

      inputs.val('');
  });
    
  }

  
    }

    

 
