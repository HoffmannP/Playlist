<?php

require('lib.php');

$db->beginTransaction();
$stmt = $db->prepare('UPDATE playlist SET position = NULL WHERE id = :id');
$stmt->execute(array(':id' => $_GET['id']));

$stmt = $db->query('SELECT id FROM playlist WHERE position IS NOT NULL ORDER BY position');
$songs = array_map(function ($song) { return $song['id']; }, $stmt->fetchAll());

$stmt = $db->prepare('UPDATE playlist SET position = :pos WHERE id = :id');
foreach ($songs as $pos => $song) {
  $stmt->execute(array(':pos' => $pos, ':id' => $song));
}
$db->commit();

if ($stmt === false) {
  throw new Exception ($db->errorInfo());
}

require('getList.php');
