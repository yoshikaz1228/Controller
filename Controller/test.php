<?php
$fp = fopen("./com.txt", "w");
fwrite($fp, "ファイルへの書き込みサンプル");
fclose($fp);
echo 'a';
?>
