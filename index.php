<!DOCTYPE HTML>
<html>
    <head>
        <title>LE JEU DE L'ESPACE INTERSTELLAIRE</title>
        <meta charset="utf-8"/>
        <link tpye="text/css" rel="stylesheet" href="css/pure-min.css"/>
        <link type="text/css" rel="stylesheet" href="css/index.css"/>
    </head>
    <body>
        <h1 class="big_title center_me">LE JEU DE L'ESPACE INTERSTELLAIRE</h1>
        <h2 class="center_me"><small class="small_things">(avec des planetes)</small></h2>
        <form class="pure-form pure-form-stacked space_form" style="width: 50%; margin:auto; margin-top:50px; text-align:center;" action="game.php" method="post">
            <fieldset>
                <legend class="legend">Configurez la partie</legend>
                <label for="nb_planets" class="labels">Nombre de planètes</label>
                <input id="nb_planets" class="pure-input-1" type="number" name="nb_planets" min="5" max="50" value="18"/>
                
                <label for="pop_begin" class="labels">Population de départ</label>
                <input id="pop_begin" type="number" class="pure-input-1" name="pop_begin" min="1" max="2000" value="200"/>
                
                <label for="nb_play" class="labels">Nombre d'ennemis</label>
                <input id="nb_play" class="pure-input-1" type="number" min="1" max="3" name="nb_ennemies" value="1"/>
                <button type="submit" value="OK" class="pure-button pure-button-primary pure-input-1 big_bt">Démarrer</button>
            </fieldset>
        </form>
        
    </body>
</html>
