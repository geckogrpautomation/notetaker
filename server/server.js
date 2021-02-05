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

// Routes

//Home Page
// Basic route that sends the user first to home page
app.get("/", (req, res) => {

    returnHTML(res,"./public/index.html");

});


//Basic route that send the user to notes.html
app.get("/notes", (req, res) => {

    returnHTML(res,"./public/notes.html");

});


//Basic route that sends the notes.JSON file contents to the user for renderign front end
app.get("/api/notes", (req, res) => {
    
    returnJSON(req,);

});

//Send user back to home page index.html if user route detected
app.get('*', (req, res) => {

    res.redirect('/');

});


//Basic route for the api that adds the users req data to the db.JSON file and then returns the altered file to the user for front end rendering
app.post("/api/notes", (req, res) => { 

    returnAddJSON(req,res);
    
    });



function returnHTML(res,path){

    res.writeHead(200, { 'Content-Type': 'text/html' });
    
    let file = path.join(__dirname, path);

    res.sendFile(file);

}


function returnJSON(res,path){
   
    filePath = path.join(__dirname, path)
 
    fs.readFile(filePath, "utf8", (err, data) => {

        if (err){

            reject(err);

        } 
        else{

            res.writeHead(200, { 'Content-Type': 'text/JSON' });
            
            res.json(data);

        }      
    });
}



function returnAddJSON(req,res){

    hash = returnHash();

    filePath = path.join(__dirname, path)
 
    fs.readFile(filePath, "utf8", (err, data) => {

        if (err){

            reject(err);

        } 
        else{

            db = JSON.parse(data);

            db.push(req.body);

            res.writeHead(200, { 'Content-Type': 'text/JSON' });

            res.json(JSON.stringify(db));
            

        }      
    });
    
}


//Return unique SHA 1 hash based upon iso date and secret
function returnHash(){

    let hash = CryptoJS.HmacSHA1(dayjs().format("YYYY-MM-DD HH:mm:ss:sss"),"lizard")
    return hash.toString(CryptoJS.enc.Base64);

}

// Starts the server to begin listening
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`)); 