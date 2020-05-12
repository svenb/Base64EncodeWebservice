const http = require('http');
const url = require('url');
const fs = require('fs');
const https = require('https');


const server = http.createServer((request, response) => {

    const queryObject = url.parse(request.url,true).query;
    
    response.writeHead(200, {'Content-Type': 'application/json'});
    
    if(queryObject.filelink != undefined) {  

        let RndId = getRndInteger(0,500);        
        download(queryObject.filelink,RndId+'.jpg',function(base64) {
            response.end(JSON.stringify({filelink: queryObject.filelink,base64code:base64 }));  
        });   
        
    }    
    else {      
        response.end(JSON.stringify({Error:'Error- no correct parameters'}));
    }

});

const port = process.env.PORT || 1337;
server.listen(port);

console.log("Server running at http://localhost:%d", port);

var download = function(url, dest, cb) {   
    
    console.log('----------------------------------------------------------------------')
    var data,base64;
    var finaldest = dest;
    var file = fs.createWriteStream(finaldest);
    https.get(url, function(response) {
      response.pipe(file);
        file.on('finish', function() {            
            file.close();
                fs.readFile(finaldest,(err,data) => {
                    if(err) {
                       throw err; 
                    }
                    else {
                        base64 = data.toString('base64');
                        cb(base64);
                        console.log("Encoded");
                        fs.unlink(finaldest,(err1) => {
                            if (err1) {
                                throw err;  
                            } 
                            else {
                                console.log(finaldest + ' was deleted');
                            }                              
                        });
                    }    
                });               
        });
    });

    console.log('----------------------------------------------------------------------')
    
    
  }  


  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }
