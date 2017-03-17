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
        <form class="center_me" action="game.php" method="post">
            <p>Nombre de planètes : <input type="text" name="nb_planets" /></p>
            <p>Population de départ : <input type="text" name="pop_begin" /></p>
            <p><input type="radio" name="nb_ennemies" value="un"/>1</p>
            <p><input type="radio" name="nb_ennemies" value="deux"/>2</p>
            <p><input type="radio" name="nb_ennemies" value="trois"/>3</p>
            <p><input type="submit" value="OK"></p>
        </form>
        
    </body>
</html>
