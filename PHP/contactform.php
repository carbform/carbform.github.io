<?php

if (isset($_POST['submit']){
    $mailFrom= $_POST['email'];
    $subject= $_POST['subject'];
    $message= $_POST['message'];

    $mailTo = "csarat49@gmail.com";
    $headers="From: ".$mailFrom;
    $txt = "You have recieved an e-mail from ".$mailFrom. ".\n\n".$message;


    mail($mailTo, $subject, $txt, $headers  );
    header("Loaction: index.php?mailsend");

})