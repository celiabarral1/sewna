<?php

class Carrusel {
    private $apiKey;
    private $numFotos;

    public function __construct() {
        $this->numFotos = 10;
        $this->apiKey ="aad7ca09450193aae0a8389b8da399ad";
    }
    public function getFotos($capital,$pais){
        $params = array(
            'api_key'	=> $this->apiKey,
            'method'	=> 'flickr.photos.search',
            'tags'	    => $capital . ',' . $pais,
            'tag_mode'  => 'all', 
            'per_page'	=> $this->numFotos,
            'format'	=> 'json',
            'nojsoncallback' => 1,
        );
        $encoded_params = array();

        foreach ($params as $k => $v){

            $encoded_params[] = urlencode($k).'='.urlencode($v);
        }
        $url = "https://api.flickr.com/services/rest/?".implode('&', $encoded_params);
        $rsp = file_get_contents($url);

        $rsp_obj = json_decode($rsp);
       
        if ($rsp_obj!=null){
            echo "<section><article> <h3>Carrusel de imágenes de $pais </h3> ";
            foreach ($rsp_obj->photos->photo as $photo) {
                $titulo = $photo->title;
                $URLfoto = "https://farm{$photo->farm}.staticflickr.com/{$photo->server}/{$photo->id}_{$photo->secret}_m.jpg";
                echo "<img alt='{$titulo}' src='{$URLfoto}' />";
            }
            
        }

        echo '<button data-action="next"> > </button>';
        echo '<button data-action="prev"> < </button>';
        echo '</article></section>'; 
        echo '<script>
            
            viajes.gestionarCarrusel();
            </script>';
    }
}

class Moneda {
    private $local;
    private $to;
    private $apikey;
    public function __construct($local,$to) {
        $this->local = $local;
        $this->to =$to;
        $this->apiKey = 'f79142879333bcd4d94a1804';
    }
    public function convertir(){
       
        $url = "https://api.exchangerate-api.com/v4/latest/{$this->to}";
        

        $request_url = $url . "?apikey=" . $this->apiKey;

        $response = file_get_contents($request_url);

        $data = json_decode($response, true);

        echo "<h3>Cambio de moneda de $this->local a $this->to</h3>";

        if ($data!=null) {
            $usd_to_eur = $data['rates'][$this->to];
             
             echo "<p> 1 $this->local = $usd_to_eur $this->to </p>";
        } else {
            echo '<p>Error al realizar el cambio.</p>';
        }

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
    <meta name ="description" content ="plantilla para desarrollar los documentos
    .html del sitio web" />
    <meta name ="keywords" content ="Plantilla, HTML" />
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" />

    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="stylesheet" type="text/css" href="estilo/viajes.css" />
    <link rel="stylesheet" type="text/css" href="estilo/carrusel.css" />
    <link rel ="icon" href="multimedia/imagenes/favicon.ico" type="image/vnd.microsoft.icon">

    <script src="https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.js"></script>
    <link href="https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css" rel="stylesheet" />

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
    <h2>Viajes</h2>
    <main>
        <section>
            <h3>Mapas</h3>
        </section>
        <article>
      
            
        </article>
        
    </main>
    <section>
    <h3>Seleccione un archivo XML: </h3>
  
    <p><label for="archivokml">Selecciona un archivo KML:</label><input type="file" 
    id="archivokml" onchange="viajes.readInputFileKml(this.files);" accept=".kml" multiple></p>

</section>
<section>
    <h3>Seleccione un archivo KML: </h3>
  
    <p><label for="archivokml">Selecciona un archivo KML:</label><input type="file" 
            id="archivokml" onchange="viajes.readInputFileKml(this.files);" accept=".kml" multiple></p>

</section>
<section>
    <h3>Seleccione un archivo SVG: </h3>
  
    <p><label for="archivoSVG">Selecciona un archivo SVG:</label>
            <input type="file" id="archivoSVG" onchange="viajes.readInputFileSvg(this.files);" accept=".svg" multiple></p>
        <section></section>

</section>
    <script src="js/viajes.js"></script>
    
</body>
</html>
';

$carrusel = new Carrusel();
$carrusel->getFotos("Riga","Letonia");

$moneda = new Moneda("USD","EUR");
$moneda->convertir();
?>