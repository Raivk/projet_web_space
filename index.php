<!DOCTYPE HTML>
<html>
    <head>
        <title>LE JEU DE L'ESPACE INTERSTELLAIRE</title>
        <meta charset="utf-8"/>
        <link tpye="text/css" rel="stylesheet" href="css/pure-min.css"/>
        <link type="text/css" rel="stylesheet" href="css/index.css"/>
        <script type="application/javascript">
            var show_help = function() {
                document.getElementById('help').classList.remove('hide');
                document.getElementById('close_help').classList.remove('hide');
            };
            
            var close_help = function() {
                document.getElementById('help').classList.add('hide');
                document.getElementById('close_help').classList.add('hide');
            }
        </script>
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
        <button id="show_help" class="pure-button pure-button-primary large_bt bottom" onclick="show_help()">Comment jouer ?</button>
        <section id="help" class="hide">
            <h2>Comment jouer ?</h2>
            <ul>
                <li>Les planètes avec la population en bleu appartiennent au joueur.</li>
                <li>Lorsque c'est au tour d'un joueur de jouer, ses planètes tournent.</li>
                <li>Pour attaquer / faire un transfert, il suffit de : 
                    <ul>
                        <li>Cliquer et maintenir enfoncé le clique sur une planète alliée</li>
                        <li>Glisser la souris en restant appuyé jusque une autre planète</li>
                        <li>Relâcher la souris pour démarrer le transfert ou l'attaque (Si relâché dans le vide, annulation)</li>
                        <li>Si on relâche sur une planète, un popup apparait, il suffit alors de vérifier les données, de remplir le champs pour la population à envoyer, et de confirmer ou non l'action.</li>
                    </ul>
                </li>
                <li>La partie se termine dès qu'il ne reste qu'un joueur en vie.</li>
            </ul>
        </section>
        <button id="close_help" class="pure-button pure-button-primary large_bt bottom hide" onclick="close_help();">Fermer l'aide</button>
    </body>
</html>
