<?php

if(isset($_GET['commands'])) {
        $commands = $_GET['commands'];
}

$command = preg_split(",",$commands);

$commandStr = 'python com.py ';

for ($com in $command){
    $commandStr.=$com . ' ';
}

?>