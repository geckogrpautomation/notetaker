const express = require('express');
let  path = require('path');
const CryptoJS = require("crypto-js");
const fs = require("fs");
const dayjs = require("dayjs");

// Sets up the Express App
const app = express();
const PORT = 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'develop/public')));

// Routes
//Home P
// Basic route that sends the user first to home page
app.get("/", (req , res) => {

    returnFile(res , "develop/public/index.html");

});


//Basic route that send the user to notes.html
app.get("/notes", (req , res) => {

    returnFile(res , "develop/public/notes.html");

});


//Basic route that sends the notes.JSON file contents to the user for renderign front end
app.get("/api/notes", (req , res) => {
    
    //returnJSON(req,res,"develop/db/db.json");    
    returnFile(res , "develop/db/db.json");

});

//Basic route for the api that adds the users req data to the db.JSON file and then returns the altered file to the user for front end rendering
app.post("/api/notes", (req , res) => { 

    postAddNote(req , res , "develop/db/db.json");       

    });
    
//Send user back to home page index.html if user route detected
app.get('*', (req , res) => {

    res.redirect('/');

});

//Return HTML file to client
function returnFile(res , pathExt){   

    res.sendFile ( path.join (__dirname , pathExt ) );

}


function postAddNote ( req , res , pathExt ) { 
    
    let filePath = path.join(__dirname, pathExt);

    let db = [];
 
    fs.readFile (filePath , "utf8" , (err , data) => {

        if (err){

            console.log(err);

            res.status(500).send("Contact your site administrator. Something went wrong")
        }
        else{
            
            hash = returnHash();        

            db = JSON.parse(data);

            db.push({title: req.body.title , text : req.body.text , id: hash});            

            res.json(JSON.stringify(db));   

            updateDbFile(db , filePath);
        }
    });
}

//Delete the json databse file and update it with the new data. 
function updateDbFile(db , filePath){

    fs.unlink(filePath, (err) => { 

        if (err) {
            
            console.log(err); 

        }

        else { 

            let data = JSON.stringify(db);

            fs.writeFile(filePath, data, 

            { 
                encoding: "utf8", 
                flag: "w"             
            },
            (err) => { 

                if (err) {

                    console.log(err); 

                }

                else { 

                  console.log(fs.readFileSync(filePath, "utf8")); 

                } 
            });        
        } 
    });   
}


//Return unique SHA 1 hash based upon iso date and secret for unique ID member inside db.JSON
function returnHash(){

    let hash = CryptoJS.HmacSHA1(dayjs().format("YYYY-MM-DD HH:mm:ss:sss"),"lizard");

    return hash.toString(CryptoJS.enc.Base64);

}

// Starts the server to begin listening
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`)); 