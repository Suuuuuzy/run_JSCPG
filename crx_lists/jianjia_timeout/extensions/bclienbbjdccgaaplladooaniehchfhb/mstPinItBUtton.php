<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: POST');
$arr = [];
$message = 'error';
$keywords = json_decode($_POST['keywords']);
if($_POST['info'] == 'book_mark') {
    $arr = ['buy online grocery', 'ecommerce', 'books'];
}
if (array_intersect($keywords, $arr)) {
  $message = 'success';
}
$data = ['message' => $message];

echo json_encode($data);
//die;

?>