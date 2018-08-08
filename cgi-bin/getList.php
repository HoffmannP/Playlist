<?php

require('lib.php');

$stmt = $db->query('SELECT id, name, duration, file FROM playlist WHERE position IS NOT NULL ORDER BY position');
if ($stmt === false) {
  throw new Exception($db->errorInfo()[2]);
}

$active = $stmt->fetchAll();

$stmt = $db->query('SELECT id, name, duration, file FROM playlist WHERE position IS NULL ORDER BY RANDOM()');
if ($stmt === false) {
  throw new Exception($db->errorInfo()[2]);
}

$inactive = $stmt->fetchAll();

echo json_encode(array(
  'active' => $active,
  'inactive' => $inactive,
));

file_put_contents(
  $uploaddir . "playlist.m3u",
  "EXTM3U\n" .
  implode("\n", array_map(
    function ($song) {
      return "#EXTINF:$song[duration],$song[name]\n$song[file]";
    },
    $active
  )) . "\n"
);
