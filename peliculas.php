<?php

class Pelicula {
    private $server;
    private $user;
    private $pass;
    private $dbname;

    private $pdo;

    public function __construct() {
        $this->server = "localhost";
        $this->user = "DBUSER2023";
        $this->pass = "DBPSWD2023";
        $this->dbname = "Peliculas";
        $this->createBase();
    }

    public function createBase(){
        try{
            $dsn = "mysql:host={$this->server}";
            $this->pdo = new PDO($dsn, $this->user, $this->pass);

            $base = "SELECT SCHEMA_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = '{$this->dbname}'";
            $existe = $this->pdo->query($base);
            $existingDatabase = $existe->fetch(PDO::FETCH_ASSOC);
            if(!$existingDatabase){
                $sql = "CREATE DATABASE {$this->dbname}";

                $this->pdo->exec($sql);
                echo "<script>alert('Base creada con éxito!');</script>";
                
            }
            
            echo "<script>alert('Esa base ya existe!');</script>";
            $this->createTables();
        }catch(PDOException $e){
            echo "<script>alert('Error creando la base de datos');</script>";
        }

        
    }

    public function checkTableExists($name){
        $sql = "SHOW TABLES LIKE '{$name}'"; 
        $result = $this->pdo->query($sql);
        $tableExists = $result->fetch(PDO::FETCH_ASSOC);
        return $tableExists;
    }
    public function createTables(){
        try {
            $this->pdo->exec("USE {$this->dbname}");
             
            $sql1 = "CREATE TABLE Pelicula (
                id_pelicula INT PRIMARY KEY AUTO_INCREMENT,
                titulo VARCHAR(255),
                id_director INT,
                id_genero INT,
                a INT
            )";
            
            if (!$this->checkTableExists('Pelicula')){
                $this->pdo->exec($sql1);
            }

            $sql2 = "CREATE TABLE Director (
                id_director INT PRIMARY KEY AUTO_INCREMENT,
                nombre VARCHAR(255),
                apellidos VARCHAR(255),
                nacionalidad VARCHAR(255) 
            )";

            if (!$this->checkTableExists('Director')){
                $this->pdo->exec($sql2);
            }

            $sql3 = "CREATE TABLE Genero (
                id_genero INT PRIMARY KEY AUTO_INCREMENT,
                nombre VARCHAR(255)
            )";
            if (!$this->checkTableExists('Genero')){
                $this->pdo->exec($sql3);
            }

            $sql4 = "CREATE TABLE Actor (
                id_actor INT PRIMARY KEY AUTO_INCREMENT,
                nombre VARCHAR(255),
                apellidos VARCHAR(255)
            )";
            if (!$this->checkTableExists('Actor')){
                $this->pdo->exec($sql4);
            }
            $sql5 = "CREATE TABLE Pelicula_Actor (
                id_participacion INT PRIMARY KEY AUTO_INCREMENT,
                id_pelicula INT,
                id_actor INT,
                papel VARCHAR(255)
            )";
            if (!$this->checkTableExists('Pelicula_Actor')){
                $this->pdo->exec($sql5);
            }
            echo "<script>alert('Las tablas ya están listas!');</script>";
        } catch(PDOException $e) {
            echo "<script>alert('Error creando tablas.');</script>";
        }
    }



    public function leerCsv($archivo){

        $lector = fopen($archivo, 'r');
        if($lector){
            while ($linea = fgetcsv($lector, 1000, ',')) {
                $identificador = $linea[0];
                if(substr($identificador, 0, 3)=='id_'){
                    $tabla = $identificador;
                    continue;
                }
                if($tabla!=$identificador){
                    if($tabla=='id_pelicula'){
                        $this->insertarPelicula($linea);
                    }else if ($tabla=='id_director'){
                        $this->insertarDirector($linea);
                    }else if ($tabla=='id_genero'){
                        $this->insertarGenero($linea);
                    }else if ($tabla=='id_actor'){
                        $this->insertarActor($linea);
                    }else if ($tabla=='id_participacion'){
                        $this->insertarParticipacion($linea);
                    }else{
                        echo "<script>alert('No se encontró tabla para insertar');</script>";
                    }
                }
                
            }
            fclose($lector);
            echo "<script>alert('Se han cargado los datos a la base!');</script>";
        } 
        else{
            echo "<script>alert('No se pudo abrir archivo');</script>";
        }

    }

    public function insertarPelicula($linea){

        $sql = "INSERT INTO Pelicula (id_pelicula, titulo, id_director, id_genero,a) 
            VALUES (:id, :titulo, :id_dir, :id_gen,:a)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':id', $linea[0]);
        $stmt->bindParam(':titulo', $linea[1]);
        $stmt->bindParam(':id_dir', $linea[2]);
        $stmt->bindParam(':id_gen', $linea[3]);
        $stmt->bindParam(':a', $linea[4]);
        $stmt->execute();
    }
    public function insertarDirector($linea){

        $sql = "INSERT INTO Director (id_director, nombre, apellidos,nacionalidad) 
            VALUES (:id, :nombre, :apellidos,:pais)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':id', $linea[0]);
        $stmt->bindParam(':nombre', $linea[1]);
        $stmt->bindParam(':apellidos', $linea[2]);
        $stmt->bindParam(':pais', $linea[3]);
        $stmt->execute();
    }
    public function insertarGenero($linea){

        $sql = "INSERT INTO Genero (id_genero, nombre) 
            VALUES (:id, :nombre)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':id', $linea[0]);
        $stmt->bindParam(':nombre', $linea[1]);
        $stmt->execute();
    }
    public function insertarActor($linea){

        $sql = "INSERT INTO Actor (id_actor, nombre, apellidos) 
            VALUES (:id, :nombre, :apellidos)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':id', $linea[0]);
        $stmt->bindParam(':nombre', $linea[1]);
        $stmt->bindParam(':apellidos', $linea[2]);
        $stmt->execute();
    }
    public function insertarParticipacion($linea){

        $sql = "INSERT INTO Pelicula_Actor (id_participacion, id_pelicula, id_actor,papel) 
            VALUES (:id, :id_pel, :id_a, :rol)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':id', $linea[0]);
        $stmt->bindParam(':id_pel', $linea[1]);
        $stmt->bindParam(':id_a', $linea[2]);
        $stmt->bindParam(':rol', $linea[3]);
        $stmt->execute();
    }

    public function escribirCsv($archivo){
        $lector = fopen($archivo . '.csv', 'w+');
        if($lector){
            $datos=$this->datosTabla('Pelicula');
            $encabezados = array_keys($datos[0]);
            fputcsv($lector, $encabezados);
            foreach ($datos as $fila) {
                fputcsv($lector, $fila);
            }
            $datos=$this->datosTabla('Director');
            $identificadores = array_keys($datos[0]);
            fputcsv($lector, $identificadores);
            foreach ($datos as $fila) {
                fputcsv($lector, $fila);
            }
            $datos=$this->datosTabla('Actor');
            $identificadores = array_keys($datos[0]);
            fputcsv($lector, $identificadores);
            foreach ($datos as $fila) {
                fputcsv($lector, $fila);
            }
            $datos=$this->datosTabla('Genero');
            $identificadores = array_keys($datos[0]);
            fputcsv($lector, $identificadores);
            foreach ($datos as $fila) {
                fputcsv($lector, $fila);
            }
            $datos=$this->datosTabla('Pelicula_Actor');
            $identificadores = array_keys($datos[0]);
            fputcsv($lector, $identificadores);
            foreach ($datos as $fila) {
                fputcsv($lector, $fila);
            }
            echo "<script>alert('El archivo se ha creado con éxito!');</script>";
        } 
        else{
            echo "<script>alert('No se pudo escribir en el archivo');</script>";
        
        }
    }

    public function datosTabla($tabla){
        $sql = "SELECT * FROM $tabla";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        $datos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
        return $datos;
    }

    public function mostrarPelis(){
        echo "<section><h3>Información sobre tus películas</h3>";
        $pelis=$this->datosTabla('Pelicula');
        foreach ($pelis as $p){
            $titulo=$p['titulo'];
            echo "<h4>{$titulo} ({$p["a"]})</h4>";
            $relaciones = $this->datosTabla('Pelicula_Actor');
            if(!empty($relaciones)){
                echo "<p>Participan los siguientes actores:</p>";
                echo "<ol>";
                foreach($relaciones as $r){

                    if($r['id_pelicula']==$p['id_pelicula']){
                        $actores = $this->datosTabla('Actor');
                        
                        foreach($actores as $a){
                            if($a['id_actor']==$r['id_actor']){
                                echo "<li>{$a["nombre"]} {$a["apellidos"]}. Personaje: {$r["papel"]}.</li>";
                            }
                        }
                       
                    }
                }
                echo "</ol>";
            }
            $directores = $this->datosTabla('Director');
            foreach($directores as $d){
                if($d['id_director']==$p['id_director']){
                    echo "<p>Dirigida por {$d["nombre"]} {$d["apellidos"]}.</p>";
                }
            }
            
            

        }
        echo "</section>";
    }


}
    


echo '
<!DOCTYPE HTML>
<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>Viajes</title>

    <meta name ="author" content ="Celia Barral" />
    <meta name ="description" content ="Almacena tus propias películas en una base de datos mysql" />
    <meta name ="keywords" content ="Película, Actor, Director, Base, Datos" />
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" />

    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel ="icon" href="multimedia/imagenes/favicon.ico" type="image/vnd.microsoft.icon">


    <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
   
</head>

<body>
    <!-- Datos con el contenidos que aparece en el navegador -->
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
    
    <h2>Películas</h2>
    <section>
    <h3>Crea tu base de datos</h3>
    <p>Si te gusta el cine aquí puedes crear una base de datos para gestionar tus películas favoritas!</p>
    <form name="crear" method="post" action="peliculas.php"> 
        <input type="hidden" name="accion" value="crearBase">
        <input type="submit" value="Crear Base">
    </form>
    <h3>Añade datos a tu base</h3>
    <p>Importa datos a la base de mediante un archivo .csv.</p>
    <form name="importar" method="post" action="peliculas.php" enctype="multipart/form-data"> 
        <input type="hidden" name="accion" value="importar">
        <input type="file" name="archivo_importar" onchange="this.form.submit()" accept=".csv">
        
    </form>
    <h3>Obtén los datos de tus películas</h3>
    <p>Exporta tus datos a un archivo .csv</p>
    <form name="exportar" method="post" action="peliculas.php" enctype="multipart/form-data">
    <p>
        <label for="archivo_exportar">Introduce nombre para el .csv:</label>
        <input type="text" id="archivo_exportar" name="archivo_exportar" aria-label="Nombre para el archivo .csv">
        <input type="hidden" name="accion" value="exportar">
        <input type="submit" value="Crear csv">
    </p>
</form>
</section>


    
</body>
</html>
';

$pelicula = new Pelicula();
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['accion'])) {
        $accion = $_POST['accion'];
        if ($accion === 'crearBase') {
            $pelicula->createBase();
        } elseif ($accion === 'importar') {
            $pelicula->leerCsv($_FILES['archivo_importar']['tmp_name']);
        } elseif ($accion === 'exportar') {
            $pelicula->escribirCsv($_POST['archivo_exportar']);
        }
    }
}
$pelicula->mostrarPelis();

?>