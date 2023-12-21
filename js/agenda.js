
    // Version 1.1 23/10/2021 
    "use strict";
class Agenda {
    constructor() {
        this.last_api_call = null;
        this.last_api_result = null;
        this.url = "http://ergast.com/api/f1/current";
        this.addEventOnClick();
    }

    loadRacesInfo() {

        if(Date.now() - this.last_api_call > 20000 || this.last_api_call===null) {
            this.last_api_call = Date.now(); 
            
            $.ajax({
                url: this.url,
                method: 'GET',
                dataType: 'xml',
                success:  (datos) =>{
                    this.last_api_result = datos;
                    this.procesarDatos(datos);
                },
                error: function (xhr, status, error) {
                    $('body').append('<p>Error al obtener las carreras:' + error + ' </p>');
                }
            });
        }else{
            this.procesarDatos(this.last_api_result);
        }
        
    }

    procesarDatos(datos){
        var races = Array.from($('Race',datos));
        races.forEach(race => {
          
            var raceName = $('RaceName',race).text();
            var circuitName = $('CircuitName',race).text();
            //coordenadas
            var lat = $('Location',datos).attr("lat");
            var long =  $('Location',datos).attr("long");
            var cityLocation = $('Locality',race).text();
            var countryLocation = $('Country',race).text();
            var date = $('Date',race).text();
            var Time = $('Time',race).text();
            var firstDate = $('Date', $('FirstPractice', race)).text();
            var firstTime = $('Time', $('FirstPractice', race)).text();
            var secDate = $('Date', $('SecondPractice', race)).text();
            var secTime = $('Time', $('SecondPractice', race)).text();
            var thirdDate = $('Date', $('ThirdPractice', race)).text();
            var thirdTime = $('Time', $('ThirdPractice', race)).text();
            var qualiDate = $('Date', $('Qualifying', race)).text();
            var qualiTime = $('Time', $('Qualifying', race)).text();

            var list = document.createElement("ul");

            var elements = [
              `Race: ${raceName}, Circuit: ${circuitName}`,
              `Location: ${cityLocation}, ${countryLocation}, Coordenadas: ${lat}, ${long}`,
              `Date: ${date}, Time: ${Time}`,
              `First Practice Date: ${firstDate}, First Practice Time: ${firstTime}`,
              `Second Practice Date: ${secDate}, Second Practice Time: ${secTime}`,
              `Third Practice Date: ${thirdDate}, Third Practice Time: ${thirdTime}`,
              `Qualifying Date: ${qualiDate}, Qualifying Time: ${qualiTime}`
            ];
          
            elements.forEach(text => {
              var elementList = document.createElement("li");
              elementList.textContent = text;
              list.appendChild(elementList);
            });
          
            $("button").after(list);
        });
    }

    verXML(){
        const boton = document.querySelector("button");
        if(boton.getAttribute("clicked") === "true"){
            $("ul").remove();
            this.loadRacesInfo();
        }else{
            boton.setAttribute("clicked", "true"); 
            this.loadRacesInfo(); 
        }
    }

    addEventOnClick() {
        const boton = document.querySelector("button");
        boton.addEventListener("click", this.verXML.bind(this));
        
    }
}


    var agenda = new Agenda();

 
