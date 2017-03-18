<!DOCTYPE HTML>
<html>
    <head>
        <title>LE JEU DE L'ESPACE INTERSTELLAIRE</title>
        <link tpye="text/css" rel="stylesheet" href="css/pure-min.css"/>
        <link type="text/css" rel="stylesheet" href="css/game.css"/>
        <script src="lib/quintus-all.js"></script>
        <script src="lib/jquery-3.1.1.min.js"></script>
    </head>
    <body>
        <div id="attack_menu" class="pure-form hide">
            <legend>Attaque !</legend>
            <h2>Départ : <span id="attack_start"></span></h2>
            <h2>Arrivée : <span id="attack_target"></span></h2>
            <h2>Pop max : <span id="attack_start_pop_max"></span></h2>
            <h2>Pop ennemie : <span id="attack_target_pop"></span></h2>
            <label for="attack_pop">Population à envoyer</label>
            <input id="attack_pop" type="number"/>
            <button class="pure-button" onclick="cancel_atk();">Annuler !</button>
            <button class="pure-button" onclick="confirm_atk();">FEU !</button>
        </div>
        <!-- ONE LINER SCRIPT BELOW -->
        <script type='text/javascript'> var game_data = <?php echo !empty($_POST)?json_encode($_POST):'null';?>; </script>

        <!-- NORMAL SCRIPTS BELOW -->
        <script src="js/game.js"></script>
    </body>
</html>