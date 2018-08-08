<?php

error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);

$uploaddir = getcwd() . '/../musik/';
$db = new PDO('sqlite:playlist.sqlite');

