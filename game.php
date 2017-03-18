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
        <!-- ONE LINER SCRIPT BELOW -->
        <script type='text/javascript'> var game_data = <?php echo !empty($_POST)?json_encode($_POST):'null';?>; </script>

        <!-- NORMAL SCRIPTS BELOW -->
        <script src="js/game.js"></script>
    </body>
</html>