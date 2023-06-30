// const http = require("http")
// const fs = require("fs")

// http.createServer((req, res) =>{
//     fs.readFile("./src/index.html", "utf-8", (error, data) => {
//         if (error) {
//           console.error(error);
//           res.writeHead(500, { "Content-Type": "text/plain" });
//           res.write("Internal Server Error");
//           return res.end();
//         }
      
//         res.writeHead(200, { "Content-Type": "text/html" });
//         res.write(data);
//           res.end();
//       });
      

// }).listen(5000,()=>{
//     console.log("server is running at 5000")
// })
const { exec } = require("child_process");
const express = require("express")

const app = express()
const fs = require("fs")

const port = process.env.PORT || 3000;
app.use(express.static("src"))

app.use(express.json());
app.post("/compiler", (req, res) =>{
    const dataFromResponse = req.body.data
    const lines = dataFromResponse.trim().split("\n");
    let convertCode = lines.filter((line) => !(line.indexOf("//") !== -1) && line.length!==0)
    convertCode =   convertCode.join("\n")
    // console.log(convertCode, "code")

    fs.writeFile("run.js", convertCode, err =>{
        if(err){
            console.log(err)
        }
    })

  

    try{
        exec("node run.js", (error, stdout, stderr) => {

            if(stdout){
                
                let outformat = stdout.trim().split("\n")
                // let newFormatted =  outformat.join("\n")
                res.send(outformat);  
            }else{
                res.send(stderr.trim()); 
            }
    
        })

    }catch(err){
        res.send(err);
    }
})

app.post("/formate", (req, res) =>{
    const dataFromResponse = req.body.data
    const lines = dataFromResponse.trim().split("\n");
    let convertCode = lines.filter((line) => !(line.indexOf("//") !== -1) && line.length!==0)
    // convertCode =   convertCode.join("\n")
    let indexOF= convertCode.findIndex(line => line.indexOf("{") !== -1)
    let lastIndexof= convertCode.findIndex(line => line.indexOf("}") !== -1)
   let tabSpecae =  convertCode.map((line, index) => {
        if( indexOF == index){
            return  line
        }else if(lastIndexof <= index){
            return  line
        }else{
            return   "   " + line
        }
    })
  res.send(tabSpecae)
})


app.listen(port, () =>{
    console.log("Server is Running!!!!!!!!!!!!!!!!!!!!!!!")
})



