<?php

require('lib.php');

if (!array_key_exists('file', $_FILES)) {
  throw new Exception("No file upload");
}

#----------------
$mimetype = explode('/', $_FILES['file']['type'])[0];
if ($mimetype !== "audio") {
  throw new Exception("$mimetype is not an audio file");
}

#----------------
$origname = basename($_FILES['file']['name']);
$parts = explode('.', $origname);
$suffix = array_pop($parts);
$idname = uniqid() . '.' . $suffix;
$tmp_name = $_FILES['file']['tmp_name'];
$uploadfile = $uploaddir . $idname;
$retVal = move_uploaded_file($tmp_name, $uploadfile);

if ($retVal !== true) {
  throw new Exception("Error moving file");
}

#----------------
exec("./mp3info -p '%S\n%a\n%t\n' '$uploadfile' 2>&1", $output, $retVal);
$duration = intval(trim($output[2]));
$artist = trim($output[3]);
$title = trim($output[4]);

if (($artist !== "") && ($title !== "")) {
  $name = $artist . " - " . $title;
} else {
  $name = implode('.', $parts);
}

$stmt = $db->query("INSERT INTO playlist
  (file, name, duration, oldname) VALUES
  ('$idname', '$name', $duration, '$origname')");

if ($stmt === false) {
  throw new Exception ($db->errorInfo()[2]);
}

echo $_FILES['file']['size'];
