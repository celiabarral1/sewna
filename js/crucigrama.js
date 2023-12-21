
    // Version 1.1 23/10/2021 
    "use strict";
    class Crucigrama {
        constructor (){
          this.board="12,*,.,=,36,#,#,#,15,#,#,*,#,/,#,#,#,*,.,"+
          ",.,=,.,#,55,#,.,*,#,=,#,=,#,/,#,=,.,#,15,#,9,*,.,=,45,=,#,#,#,#,#,=,#,#,72,#,20,-,.,=,11,#,.,#,#,"+
          ",#,+,#,#,#,*,56,/,.,=,.,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,12,#,16,*,.,=,32";
          // this.board="4,*,.,=,12,#,#,#,5,#,#,*,#,/,#,#,#,*,4,,.,=,.,"+
          // // "#,15,#,.,*,#,=,#,=,#,/,#,=,.,#,3,#,4,*,.,=,20,=,#,#,#,#,#,=,#,#,8,#,9,-,.,="+
          // // ",3,#,.,#,#,,#,+,#,#,#,*,6,/,.,=,.,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,6,#,8,*,.,=,16";
          // this.board = "4,.,.,=,36,#,#,#,25,#,#,*,#,.,#,#,#,.,.,"+
          // ",.,=,.,#,15,#,.,*,#,=,#,=,#,.,#,=,.,#,18,#,6,*,.,=,30,=,#,#,#,#,#,=,#,#,56,#,9,"+
          // ",.,=,3,#,.,#,#,*,#,+,#,#,#,*,20,.,.,=,18,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,18,#,24,.,.,=,72";
          // this.nivel='Difícil';
          this.nivel='Fácil';
          // this.nivel='Intermedio';
          this.filas=11;
          this.columnas=9;
          this.init_time;
          this.end_time;
          this.tablero;
          this.expression_row=true;
          this.expression_col=true;
          this.createArray();
          this.start();
        }

        mostrarNivel(){
          const seccion = document.querySelector('section:nth-child(3)');
          var nivel = "Nivel: " + this.nivel;
          const parrafoNivel = document.createElement('h4');

          parrafoNivel.textContent = nivel;

          seccion.appendChild(parrafoNivel);

        }
        createArray(){
          this.tablero=[this.filas];
          for(let i=0;i<this.filas;i++){
            this.tablero[i] = new Array(this.columnas);
          }
        }

        start(){
          let boardSeparada = this.board.split(',');
          for(var i = 0; i<this.filas; i++){
            for(var j = 0; j<this.columnas; j++){
              var index = i * this.columnas + j;
              var value=boardSeparada[index];
              if(value == '.'|| value == ''){
                this.tablero[i][j] = 0;
              }else if (value=='#'){
                this.tablero[i][j] = -1;
              }else{
                this.tablero[i][j] = value;
              }
            }
          }
        }

        paintMathword(){

          var main = document.querySelector('main');
          for(var i = 0; i<this.filas; i++){
            for(var j = 0; j<this.columnas; j++){
              var celda = document.createElement('p');
              celda.setAttribute('data-state', 'unclicked'); 
              
              if(this.tablero[i][j]==0){
                this.addClickHandler(celda);
              }else if(this.tablero[i][j]==-1){
                celda.setAttribute('data-state', 'empty'); 
              }else{
                celda.textContent = this.tablero[i][j];
                celda.setAttribute('data-state', 'blocked'); 
              }

              main.appendChild(celda);
            }
            
          }
          this.init_time = new Date();
        }

        addClickHandler(celda) {
          celda.addEventListener('click', () => {
            if (celda.getAttribute('data-state') === 'unclicked' ){
              celda.setAttribute('data-state', 'clicked');
              //solo una en click
              const celdas = document.querySelectorAll('p[data-state="clicked"]');
              console.log(celdas);
              celdas.forEach(c => {
                if (c !== celda) {
                  c.setAttribute('data-state', 'unclicked'); 
                }
              });
            } 
          });
        }

        check_win_condition(){
          for(var i = 0; i<this.filas; i++){
            for(var j = 0; j<this.columnas; j++){
              if(this.tablero[i][j]==0){
                return false;
              }
            }
        }
        return true;
      }

      calculate_date_difference(){
        var time = new Date(this.end_time - this.init_time);
        var h = time.getUTCHours();
        var m = time.getUTCMinutes();
        var s = time.getUTCSeconds();

        var horas = (h < 10) ? "0" + h : h;
        var mins = (m < 10) ? "0" + m : m;
        var segs = (s < 10) ? "0" + s : s;
      
        var time_final = horas + ":" + mins + ":" + segs;

        return time_final;
      }

      introduceElement(key){
        
        const celdas = document.querySelectorAll('main p');
        for(let i = 0; i<celdas.length;i++){
            if(celdas[i].getAttribute('data-state')==='clicked'){
              
              let row = Math.floor(i / 9); 
              let col = i%9;
              this.tablero[row][col]=key;
              var next_casilla_h = this.tablero[row][col+1];
              // vertiente horizontal
              if(next_casilla_h!=-1){
                // comprobar q no se salga del tablero j-3 y tal
                for(let j=col+1; j<this.columnas;j++){
                    if(this.tablero[row][j]=='='){
                      var first_number = this.tablero[row][j-3];
                      var second_number = this.tablero[row][j-1];
                      var expression = this.tablero[row][j-2];
                      var result = this.tablero[row][j+1];
                      if (first_number !== 0 && second_number !== 0 && expression !== 0 && result !== 0){
                        var expr_join = [first_number, expression, second_number].join(" ");
                        var result_eval = eval(expr_join);
                        if(result!=result_eval){
                          this.expression_row=false;
                        }
                      }
                      break;
                    }
                }
              }
              // vertiente vertical
              if(row+1 < this.filas && this.tablero[row+1][col]!=-1){
                for(let j=row+1; j<this.filas;j++){
                    if(this.tablero[j][col]=='='){
                      var first_number = this.tablero[j-3][col];
                      var second_number = this.tablero[j-1][col];
                      var expression = this.tablero[j-2][col];
                      var result = this.tablero[j+1][col];
                      if (first_number !== 0 && second_number !== 0 && expression !== 0 && result !== 0){
                        var expr_join = [first_number, expression, second_number].join(" ");
                        var result_eval = eval(expr_join);
                        if(result!=result_eval){
                          this.expression_col=false;
                        }
                      }
                      break;
                    }
                }
              }
              if(this.expression_col==true && this.expression_row==true){
                this.tablero[row][col]=key;
                celdas[i].textContent=key;
                celdas[i].setAttribute('data-state','correct');
                if(this.check_win_condition()){
                  this.end_time= new Date();
                  alert("El usuario tardó " + this.calculate_date_difference() + " en realizar el crucigrama");
                  this.createRecordForm();
                }
              }else{
                //volver estado inicial
                this.tablero[row][col]=0;
                celdas[i].setAttribute('data-state','unclicked');
                this.addClickHandler(celdas[i]);
                this.expression_col=true;
                this.expression_row=true;
                alert("El número introducido no es correcto.");
              }
              
              break;
            }
          }
      }

      calculate_date_difference_seconds(){
        return Math.floor((this.end_time - this.init_time) / 1000);
      }

      createRecordForm(){
        var form = '<section><h3>Introduce tus datos</h3><form action="#" method="post" name="calculadora">' +
        '<p>Nombre:' +
          '<input type="text" name="nombre" value>' +
        '</p>' +
        '<p>Apellidos:' +
          '<input type="text" name="apellidos" value>' +
        '</p>' +
        '<p>Nivel:' +
          '<input type="text" name="nivel" value="' + this.nivel + '" readonly="">' +
        '</p>' +
        '<p>Tiempo (s):' +
          '<input type="text" name="tiempo" value="'+ this.calculate_date_difference_seconds() + '" readonly="">' +
        '</p>' +
          '<input type="submit" value="Enviar">' +
        '</form></section>';

        $('body').append(form);
      }

      }

    var crucigrama = new Crucigrama();
 
