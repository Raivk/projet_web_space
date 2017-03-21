<!DOCTYPE HTML>
<html>
    <head>
        <title>LE JEU DE L'ESPACE INTERSTELLAIRE</title>
        <meta charset="utf-8"/>
        <link tpye="text/css" rel="stylesheet" href="css/pure-min.css"/>
        <link type="text/css" rel="stylesheet" href="css/game.css"/>
        <script src="lib/quintus-all.js"></script>
        <script src="lib/jquery-3.1.1.min.js"></script>
    </head>
    <body>
        <div id="HUD">
            
        </div>
        <div id="full_background_atk" class="none hide"></div>
        <div id="attack_menu" class="none hide">
            <div id="attack_form" class="pure-form pure-form-stacked hide">
                <legend class="big_text">Transfert !</legend>
                <label for="attack_start" class = "medium_text">Départ</label>
                <input class="pure-u-1 attack_inputs" id="attack_start" type="text" readonly/>

                <label for="attack_target" class = "medium_text">Arrivée</label>
                <input class="pure-u-1 attack_inputs" id="attack_target" type="text" readonly/>

                <label for="attack_start_pop_max" class = "medium_text">Population de la planète de départ</label>
                <input class="pure-u-1 attack_inputs" id="attack_start_pop_max" type="text" readonly/>

                <label for="attack_target_pop" class = "medium_text">Population de la planète d'arrivée</label>
                <input class="pure-u-1 attack_inputs" id="attack_target_pop" type="text" readonly/>

                <label for="attack_pop" class = "medium_text">Population à envoyer</label>
                <input class="pure-u-1 attack_inputs" id="attack_pop" type="number"/>
                
                <label for="arrival" class = "medium_text">Durée estimée</label>
                <input class="pure-u-1 attack_inputs" id="arrival" type="text" readonly/>
                
                <div class="pure-g pure-u-1 slight_margins_vert">
                    <button class="pure-button button-error pure-u-1-3" onclick="cancel_atk();">Annuler !</button>
                    <button class="pure-button button-success pure-u-1-3" onclick="confirm_atk();">Décollage !</button>
                </div>
            </div>
        </div>
        <!-- ONE LINER SCRIPT BELOW -->
        <script type='text/javascript'> var game_data = <?php echo !empty($_POST)?json_encode($_POST):'null';?>; </script>

        <!-- NORMAL SCRIPTS BELOW -->
        <script src="js/game.js"></script>
    </body>
</html>