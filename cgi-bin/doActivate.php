<?php

require('lib.php');

$stmt = $db->prepare('UPDATE playlist SET position = (SELECT COUNT(*) FROM PLAYLIST WHERE position IS NOT NULL) + 1 WHERE id = :id');
$stmt->execute(array(':id' => $_GET['id']));

if ($stmt === false) {
  throw new Exception ($db->errorInfo());
}

require('getList.php');
