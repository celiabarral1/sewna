
    // Version 1.1 23/10/2021 
    "use strict";
    class Sudoku {
        constructor (){
          this.cadenaTablero="3.4.69.5....27...49.2..4....2..85.198.9...2.551.39..6....8..5.32...46....4.75.9.6";
          this.filas=9;
          this.columnas=9;
          this.tablero=[];
          for(var i = 0; i<this.filas; i++){
            this.tablero[i] = [this.columnas];
          }

          this.start();
        }

        start(){
          for(var i = 0; i<this.filas; i++){
            for(var j = 0; j<this.columnas; j++){
              var index = i * this.columnas + j;
              var value=this.cadenaTablero.charAt(index);
              if(value == '.'){
                this.tablero[i][j] = 0;
              }else{
                this.tablero[i][j] = parseInt(value);
              }
            }
          }
        }

        createStructure(){
          var main = document.querySelector('main');
          for(var i = 0; i<this.filas; i++){
            for(var j = 0; j<this.columnas; j++){
              var celda = document.createElement('p');
              celda.setAttribute('data-state', 'unclicked'); 
              
              if(this.tablero[i][j]!=0){
                celda.textContent = this.tablero[i][j];
                celda.setAttribute('data-state', 'blocked');
              }
              this.addClickHandler(celda);
            
              
              main.appendChild(celda);
            }
          }
        }

        paintSudoku(){
          this.createStructure();
        }

        addClickHandler(celda) {
          const evento_click = () => {
          if (celda.getAttribute('data-state') === 'unclicked' || celda.getAttribute('data-state') === 'correct') {
            celda.setAttribute('data-state', 'clicked');
          } else if (celda.getAttribute('data-state') === 'blocked'){
            celda.setAttribute('data-state', 'blocked');
          } else {
            celda.setAttribute('data-state', 'unclicked');
          }
        };
      
        celda.addEventListener('click', evento_click);
      
        celda.click_event = evento_click;
        }

      

        introduceNumber(key){
        const celdas = document.querySelectorAll('p');
        for(let i = 0; i<celdas.length;i++){
            if(celdas[i].getAttribute('data-state')==='clicked'){
              let row = Math.floor(i / 9); 
              let col = i%9;
   
              if(this.validateRowAndColumn(row,col,key) && this.validateCuadricula(row,col,key)){
                this.tablero[row][col]=key;
                celdas[i].textContent = key;
                celdas[i].removeEventListener('click', celdas[i].click_event);
                celdas[i].setAttribute('data-state','correct'); 
                this.checkComplete();
              }else{
                celdas[i].setAttribute('data-state','unclicked'); 
                alert('El número no es correcto!');
                
              }
             
            }
        }
        
        }

        validateRowAndColumn(fila,col,key){
          for(let i = 0; i<this.tablero[fila].length;i++){
              if(this.tablero[fila][i]==key) return false;
              if(this.tablero[i][col]==key) return false;
          }
          return true;
        }

        validateCuadricula(fila,col,key){
          const startRow = Math.floor(fila / 3) * 3;
          const startColumna = Math.floor(col / 3) * 3;
          for (let i = 0; i < 3; i++) {
              for (let j = 0; j < 3; j++) {
                  if (this.tablero[startRow + i][startColumna + j] === key) {
                      return false;
                  }
              }
          }
          return true;
        }

        checkComplete(){
          for(var i = 0; i<this.filas; i++){
            for(var j = 0; j<this.columnas; j++){
              if(this.tablero[i][j]==0){
                return false;
              }
            }
        }
        return true;
      }
    }

    var sudoku = new Sudoku();
 
