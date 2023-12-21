
    // Version 1.1 23/10/2021 
    "use strict";
    class Memoria {

        constructor (){
            this.hasFlippedCard = false;
            this.lockBoard = false;
            this.firstCard = null;
            this.secondCard = null;
            this.elements = {
                cards: [
                  {
                    element: "HTML5",
                    source: "https://upload.wikimedia.org/wikipedia/commons/3/38/HTML5_Badge.svg"
                  },
                  {
                    element: "HTML5",
                    source: "https://upload.wikimedia.org/wikipedia/commons/3/38/HTML5_Badge.svg"
                  },
                  {
                    element: "CSS3",
                    source: "https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg"
                  }
                  ,
                  {
                    element: "JS",
                    source: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Javascript_badge.svg"
                  },
                  {
                    element: "PHP",
                    source: "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg"
                  },
                  {
                    element: "SVG",
                    source: "https://upload.wikimedia.org/wikipedia/commons/4/4f/SVG_Logo.svg"
                  },
                  {
                    element: "W3C",
                    source: "https://upload.wikimedia.org/wikipedia/commons/5/5e/W3C_icon.svg"
                  },
                  
                  {
                    element: "CSS3",
                    source: "https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg"
                  }
                  ,
                  {
                    element: "JS",
                    source: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Javascript_badge.svg"
                  },
                  {
                    element: "PHP",
                    source: "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg"
                  },
                  {
                    element: "SVG",
                    source: "https://upload.wikimedia.org/wikipedia/commons/4/4f/SVG_Logo.svg"
                  },
                  {
                    element: "W3C",
                    source: "https://upload.wikimedia.org/wikipedia/commons/5/5e/W3C_icon.svg"
                  }
                ]
              };
              this.shuffleElements(); 
              this.createElements();
              this.addEventListeners();
        }

        shuffleElements() {
            var cards = this.elements.cards;
            for (let i = cards.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [cards[i], cards[j]] = [cards[j], cards[i]];
            }
            this.elements.cards = cards;
          
        }



        unflipCards(){
            this.lockBoard = true;
            setTimeout(() => {
              this.firstCard.setAttribute('data-state', 'hidden');
              this.secondCard.setAttribute('data-state', 'hidden');
              this.resetBoard();
          }, 2000);
        }

        resetBoard(){
            this.firstCard = null;
            this.secondCard = null;
            this.hasFlippedCard = false;
            this.lockBoard = false;
        }

        disableCards(){
          setTimeout(() => {
          this.firstCard.setAttribute('data-state', 'revealed');
          this.secondCard.setAttribute('data-state', 'revealed');
          this.resetBoard();
        }, 1000);
      }


        checkForMatch(){
            if(this.firstCard!=null && this.secondCard!=null){
                if(this.firstCard.dataset.element === this.secondCard.dataset.element){
                    this.disableCards();
                }else{
                    this.unflipCards();
                }
            }
        }

    
        createElements(){
          var body = document.querySelector('body > section:nth-of-type(2)');
          this.elements.cards.forEach(card => {
            // Crear un nuevo nodo article
            var article = document.createElement('article');

            article.setAttribute('data-element', card.element);

            var h4 = document.createElement('h4');
            h4.textContent = "Tarjeta de memoria";
            article.appendChild(h4);

            var img = document.createElement('img');
            img.src = card.source;
            img.alt = card.element; 
            article.appendChild(img);

            body.appendChild(article);
          });
        }

        addEventListeners() {
          const cards = document.querySelectorAll('body > section:nth-of-type(2) article');
      
          cards.forEach(card => {
            card.addEventListener('click', this.flipCard.bind(card, this));
          });
        }

        flipCard(game, event) {
          // La tarjeta a la que se hizo click
          const clickedCard = event.currentTarget;

          if (game.lockBoard) return; 
          if(clickedCard.getAttribute('data-state')==='revealed') return;
          
          if (clickedCard === game.firstCard)return; 

          clickedCard.setAttribute('data-state', 'flip');

          if (!game.hasFlippedCard) {
            game.hasFlippedCard = true;
            game.firstCard = clickedCard;
            return;
          }

          game.secondCard = clickedCard;
          game.checkForMatch();
        }
        
    }

    var memoria = new Memoria();

 
