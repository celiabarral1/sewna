<?php

class Record {
    private $server;
    private $user;
    private $pass;
    private $dbname;

    public function __construct() {
        $this->server = "localhost";
        $this->user = "DBUSER2023";
        $this->pass = "DBPSWD2023";
        $this->dbname = "records";
    }

    public function getRecords($pdo,$nivel){
        try{
            $sql = "SELECT nombre, apellidos, tiempo FROM registro WHERE nivel = :nivel ORDER BY tiempo LIMIT 10";
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':nivel', $nivel);
            if ($stmt->execute()) {
                $data = $stmt->fetchAll();
                if ($data) {
                    echo "<h3>Top 10 tiempos para el nivel: " . $nivel ."</h3>";
                    echo "<ol>";
                    foreach ($data as $record) {
                        $nombre = $record['nombre'];
                        $apellidos = $record['apellidos'];
                        $tiempo = $record['tiempo'];

                        $tiempo_formateado = gmdate("H:i:s", $tiempo);
            
                        echo "<li>Nombre: " . $nombre . ", Apellidos: " . $apellidos . " - Tiempo: " . $tiempo_formateado . "</li>";
                    }
                    echo "</ol>";
                } else {
                    echo "<p>No hay registros para este nivel.</p>";
                }
            } else {
                echo "<script>alert('Error al recuperar los records.');</script>";
            }

        }catch(PDOException $e) {
            echo "<script>alert('Error de conexión');</script>";
        }
    }
    
    public function insertRecord($nombre,$apellidos,$nivel,$tiempo){
        try {
            $dsn = "mysql:host={$this->server};dbname={$this->dbname}";
            $pdo = new PDO($dsn, $this->user, $this->pass);
            $sql = "INSERT INTO registro (nombre, apellidos, nivel, tiempo) VALUES (:nombre, :apellidos, :nivel, :tiempo)";
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':nombre', $nombre);
            $stmt->bindParam(':apellidos', $apellidos);
            $stmt->bindParam(':nivel', $nivel);
            $stmt->bindParam(':tiempo', $tiempo);

            if ($stmt->execute()) {
                $this->getRecords($pdo,$nivel);
            } else {
                echo "<script>alert('Error al insertar');</script>";
            }
        } catch(PDOException $e) {
            echo "<script>alert('Error de conexión');</script>";
        }
    } 

    public function recibirDatosFormulario() {
        if (count($_POST)>0) {
            $nombre = $_POST["nombre"] ?? "";
            $apellidos = $_POST["apellidos"] ?? "";
            $nivel = $_POST["nivel"] ?? "";
            $tiempo = $_POST["tiempo"] ?? "";

            if (!empty($nombre) && !empty($apellidos) && !empty($nivel) && !empty($tiempo)) {
                $this->insertRecord($nombre, $apellidos, $nivel, $tiempo);
            } else {
                echo "<script>alert('Debe rellenar todos los campos');</script>";
            }
        }
    }
    
  }



  echo '<!DOCTYPE HTML>
  <html lang="es">
  <head>
      <!-- Datos que describen el documento -->
      <meta charset="UTF-8" />
      <title>EscritorioVirtual.Crucigrama</title>
  
      <meta name="author" content="Celia Barral" />
      <meta name="description" content="Juego de un crucigrama matemático." />
      <meta name="keywords" content="Crucigrama, record" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
      <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
      <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
      <link rel="stylesheet" type="text/css" href="estilo/crucigrama.css" />
      <link rel="stylesheet" type="text/css" href="estilo/estilo_botonera.css" />
  
      <link rel="icon" href="multimedia/imagenes/favicon.ico" type="image/vnd.microsoft.icon">
  
      <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
      <script src="js/crucigrama.js"></script>
  </head>
  
  <body>
      <!-- Datos con el contenido que aparece en el navegador -->
      <header>
          <h1>Escritorio Virtual</h1>
          <nav>
              <a accesskey="i" tabindex="1" href="index.html">Índice</a>
              <a accesskey="n" tabindex="2" href="noticias.html">Noticias</a>
              <a accesskey="s" tabindex="3" href="sobremi.html">Sobre Mí</a>
              <a accesskey="a" tabindex="4" href="agenda.html">Agenda</a>
              <a accesskey="j" tabindex="5" href="juegos.html">Juegos</a>
              <a accesskey="v" tabindex="6" href="viajes.php">Viajes</a>
              <a accesskey="m" tabindex="7" href="metereologia.html">Meteorología</a>
          </nav>
      </header>
      <section>
          <h3>Menú de juegos</h3>
          <nav>
              <a accesskey="m" tabindex="8" href="memoria.html">Memoria</a>
              <a accesskey="s" tabindex="9" href="sudoku.html">Sudoku</a>
              <a accesskey="c" tabindex="10" href="crucigrama.php">Crucigrama</a>
          </nav>
      </section>
      <section>
          <h2>Cucrigrama</h2>
          <p>
              Bienvenidos a este juego matemático. Para comenzar a jugar, es necesario hacer click sobre una de las celdas vacías. Esta, se marcará en verde. Ni el fondo negro ni las celdas ya con números se pueden modificar. 
          </p>
          <p>
              Con la casilla una vez seleccionada, la estructura del juego es la siguiente: Se debe completar una expresión matemática del tipo "número1 operador número2 = resultado". 
          </p>
          <ol>
              <li>Tanto número1 como número2, deben ser un valor del 0 al 9.</li>
              <li>El operador puede ser: * (multiplicación), / (división), + (suma), - (resta).</li>
          </ol>
          <p>IMPORTANTE: Para introducir los valores puede hacerse mediante el teclado o pulsando los botones que se encuentran debajo del crucigrama.</p>
          <p>Esa estructura se muestra tanto en las operaciones verticales como en las horizontales. Es necesario introducir el valor correcto en todas las expresiones afectadas.</p>
      </section>
  
      <main>
      </main>
  
      <script>
      crucigrama.paintMathword();
      document.addEventListener(\'keydown\', (event) => {
          const clicked = document.querySelector(\'p[data-state="clicked"]\');
          const inForm = document.activeElement.tagName.toLowerCase() === "input";
          if (!inForm) {
              if (clicked != null) {
                  if ((!isNaN(event.key) && event.key >= 1 && event.key <= 9) || (["+", "-", "*", "/"].includes(event.key))) {
                      crucigrama.introduceElement(event.key);
                  } else {
                      clicked.setAttribute(\'data-state\', \'unclicked\');
                      alert(\'Debe introducir un número o un operador aritmético\');
                  }
              } else {
                  clicked.setAttribute(\'data-state\', \'unclicked\');
                  alert(\'Debe seleccionar una celda antes de pulsar un número\');
              }
          }
      });
  
          crucigrama.mostrarNivel();
      </script>
  
      <section data-type="botonera">
          <h2>Botonera</h2>
          <button onclick="crucigrama.introduceElement(1)">1</button>
          <button onclick="crucigrama.introduceElement(2)">2</button>
          <button onclick="crucigrama.introduceElement(3)">3</button>
          <button onclick="crucigrama.introduceElement(4)">4</button>
          <button onclick="crucigrama.introduceElement(5)">5</button>
          <button onclick="crucigrama.introduceElement(6)">6</button>
          <button onclick="crucigrama.introduceElement(7)">7</button>
          <button onclick="crucigrama.introduceElement(8)">8</button>
          <button onclick="crucigrama.introduceElement(9)">9</button>
          <button onclick="crucigrama.introduceElement(\'*\')">* (multiplicación)</button>
          <button onclick="crucigrama.introduceElement(\'+\')">+ (suma)</button>
          <button onclick="crucigrama.introduceElement(\'-\')">- (resta)</button>
          <button onclick="crucigrama.introduceElement(\'/\')">/ (división)</button>
      </section>
  </body>
  </html>';
  
  
  

$record = new Record();

$record->recibirDatosFormulario();



?>
