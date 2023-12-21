
    // Version 1.1 23/10/2021 
    "use strict";
    class Pais {
        //añadir altitud

        constructor (nombre,capital,poblacion){
            this.nombre=nombre;
            this.capital=capital;
            this.poblacion=poblacion;
            this.apikey="712766893f4a133c23b75824d4e2b8a4";
        }

        inicializar(){
            this.gobierno = "Democracia Representativa";
            this.latitud = "56.946";
            this.longitud = "24.10589";
            this.religion = "Cristianismo";
        }

    // Atributos texto
        nombreText(){
            return this.nombre;
        }

        capitalText(){
            return this.capital;
        }

        poblacionText(){
            return this.poblacion;
        }
        gobiernoText(){
            return this.gobierno;
        }
        religionText(){
            return this.religion;
        }

        informacionSecundaria(){
            return ("<ul><li>Población: "+this.poblacion+ "</li><li>Forma de gobierno: "+this.gobierno+ "</li><li>Religión mayoritaria: "+this.religion+ "</li>" + "</ul>");
        }

        coordenadas(){
            document.write("<p>Latitud: "+this.latitud + ", longitud: " + this.longitud + "</p>");
        }

        getInfoPais(){
            document.write("<section>")
            document.write("<h3>" + this.nombreText() + "</h3>");
            document.write("<p>Cuya capital es: " + this.capitalText() + "</p>");
            this.coordenadas();
            document.write(this.informacionSecundaria());
            document.write("</section>")
            
        }

        cargarDatos(){
            var section = document.createElement("section");
            var url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + this.latitud + "&lon=" + this.longitud +  "&exclude=minutely,hourly,alerts&units=metric" +"&appid=" + this.apikey;
            $.ajax({
                dataType: "json",
                url: url,
                method: 'GET',
                success: function(datos){
                    var h3 = document.createElement("h3"); 
                    h3.innerHTML = "El tiempo en los próximos 5 días";
                    section.append(h3);

                    datos.daily.forEach((dia,i) =>{
                        if(i>0 && i<6){ //el primero es el actual, y los otros los 5 siguientes
                            
                            var dayStamp = dia.dt;
                            var date = new Date(dayStamp * 1000); 
                            
                            var day = date.getDate();
                            var year = date.getFullYear();
                            var month = date.getMonth() + 1; 
    
                            

                            var elemento = document.createElement("section"); 
                         
                            var stringDatos = "<h4> " + day + "/" + month + "/" + year + "</h4><ul> " ;
                            stringDatos += "<li>Temperatura máxima: " + dia.temp.max + " ºC</li>";
                            stringDatos += "<li>Temperatura mínima: " + dia.temp.min + " ºC</li>";
                            stringDatos += "<li>Humedad: " + dia.humidity + " %</li>";
                            stringDatos += "<li>Lluvia: " + dia.pop + " %</li></ul>";
                            var iconoURL = "https://openweathermap.org/img/w/" + dia.weather[0].icon + ".png";
                            var iconoWeather = dia.weather[0].main ;
                            stringDatos += "<img src='" + iconoURL + "' alt='Icono del clima - " + iconoWeather + "' />";
        
                            
                            elemento.innerHTML = stringDatos;
                            section.append(elemento);
                        }
                       

                    } )
                   
                        
                    },
                error:function(){
                    var error = document.createElement("p"); 
                    error.innerHTML = "No pudieron encontrarse los datos del tiempo.";
                    section.append(error);
                    }
            });
            document.body.appendChild(section);
        }
    }
    var pais = new Pais("Letonia", "Riga", "1.884 millones");
    pais.inicializar();

 
