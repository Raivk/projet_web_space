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
        <form class="pure-form pure-form-stacked space_form" style="width: 50%; margin:auto; margin-top:50px; text-align:center;" action="game.php" method="post">
            <fieldset>
                <legend class="legend">Configurez la partie</legend>
                <label for="nb_planets" class="labels">Nombre de planètes</label>
                <input id="nb_planets" class="pure-input-1" type="number" name="nb_planets"/>
                
                <label for="pop_begin" class="labels">Population de départ</label>
                <input id="pop_begin" type="number" class="pure-input-1" name="pop_begin"/>
                
                <label class="radios labels">Nombre d'ennemis</label>
                
                <label for="option-one" class="pure-radio labels">
                    <input id="option-one" class="pure-input-1" type="radio" name="nb_ennemies" value="1" />
                    1
                </label>

                <label for="option-two" class="pure-radio labels">
                    <input id="option-two" class="pure-input-1" type="radio" name="nb_ennemies" value="2"/>
                    2
                </label>
                
                <label for="option-three" class="pure-radio labels">
                    <input id="option-three" class="pure-input-1" type="radio" name="nb_ennemies" value="3"/>
                    3
                </label>
                <button type="submit" value="OK" class="pure-button pure-button-primary pure-input-1 big_bt">Démarrer</button>
            </fieldset>
        </form>
        
    </body>
</html>
