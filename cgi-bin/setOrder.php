<?php

require('lib.php');

$db->beginTransaction();
$stmt = $db->query('UPDATE playlist SET position = NULL WHERE position IS NOT NULL');

$songs = JSON_decode($_GET['order']);

$stmt = $db->prepare('UPDATE playlist SET position = :pos WHERE id = :id');
foreach ($songs as $pos => $song) {
  $stmt->execute(array(':pos' => $pos, ':id' => $song));
}
$db->commit();

if ($stmt === false) {
  throw new Exception ($db->errorInfo());
}

require('getList.php');
