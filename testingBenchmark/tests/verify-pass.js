function verify() {
    checkpass = document.getElementById("passward").value;
    split = 4;
    if (checkpass.substring(split*7, split*8) == '1234') {
      if (checkpass.substring(split*6, split*7) == '1234') {
        if (checkpass.substring(split*5, split*6) == '1234') {
         if (checkpass.substring(split*4, split*5) == '1234') {
          if (checkpass.substring(split*3, split*4) == '1234') {
            if (checkpass.substring(split*2, split*3) == '1234') {
              if (checkpass.substring(split*1, split*2) == '1234') {
                if (checkpass.substring(split*0,split*1) == 'ABCD') {
                  alert("Access Granted")
                  }
                }
              }
      
            }
          }
        }
      }
    }
    else {
      alert("Incorrect password");
    }
}
