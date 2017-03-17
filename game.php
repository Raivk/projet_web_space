<!DOCTYPE HTML>
<html>
    <head>
        <title>LE JEU DE L'ESPACE INTERSTELLAIRE</title>
        <link tpye="text/css" rel="stylesheet" href="css/pure-min.css"/>
        <link type="text/css" rel="stylesheet" href="css/index.css"/>
    </head>
    <body>
        <h1 class="big_title center_me">LE JEU DE L'ESPACE INTERSTELLAIRE</h1>
        <h2 class="center_me"><small class="small_things">(avec des planetes)</small></h2>
        <br/>
        
        <?php
            echo "<div class='center_me'>";
            echo "<p> Nombre de planètes : {$_POST['nb_planets']}</p>";
            echo "<p> Population de départ : {$_POST['pop_begin']}</p>";
            echo "<p> Nombre d'adversaires' : {$_POST['nb_ennemies']}</p>";
            echo "</div>";
        ?>
        
    </body>
</html>