const express = require('express');
let  path = require('path');
const CryptoJS = require("crypto-js");
const fs = require("fs");
const dayjs = require("dayjs");

// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 8080

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Routes
//Home P
// Basic route that sends the user first to home page
app.get("/", (req , res) => {

    res.sendFile ( path.join (__dirname , "public/index.html") );    
    
});


//Basic route that send the user to notes.html
app.get("/notes", (req , res) => {

    res.sendFile ( path.join (__dirname , "public/notes.html") );  
    
});


//Basic route that sends the notes.JSON file contents to the user for renderign front end
app.get("/api/notes", (req , res) => {

    res.sendFile ( path.join (__dirname , "db/db.json") );
    
});

//Basic route for the api that adds the users req data to the db.JSON file and then returns the altered file to the user for front end rendering
app.post("/api/notes", (req , res) => { 

    postAddNote(req , res , "db/db.json");      
    res.sendFile ( path.join (__dirname , "db/db.json") );
    
});

 //Basic route for the api that adds the users req data to the db.JSON file and then returns the altered file to the user for front end rendering
app.delete("/api/notes/:id", (req , res) => { 

    let id = req.params.id;
    
    deleteNote(res,"db/db.json",id);   
    res.sendFile ( path.join (__dirname , "db/db.json" ) );
   
});   
    
//Send user back to home page index.html if user route detected
app.get('*', (req , res) => {

    res.redirect('/');
    
});


function postAddNote ( req , res , pathExt ) { 
    
    let filePath = path.join(__dirname, pathExt);

    let db = [];
 
    fs.readFile (filePath , "utf8" , (err , data) => {

        if (err){

            console.log(err);

            res.status(500).send("Contact your site administrator. Something went wrong")
        }
        else{
                            
            
            db = JSON.parse(data);            

            let msg = JSON.stringify( req.body.title) + JSON.stringify(req.body.text);

            const SD5 = returnSD5(msg);

            db.push({title: req.body.title , text : req.body.text , id: SD5});         

            updateDbFile(db , filePath);                        
            
        }
    });
}

//Delete the json databse file and update it with the new data. 
function updateDbFile(db , filePath){

    fs.unlink(filePath, (err) => { 

        if (err) {
            
            res.status(500).send("Server Error contact site administrator"); 

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

                    res.status(500).send("Server Error contact site administrator"); 

                }
                
            });        
        } 
    });   
}


function deleteNote(res, pathExt,id){

    let filePath = path.join(__dirname, pathExt);

       
    fs.readFile (filePath , "utf8" , (err , data) => {

        if (err){

            console.log(err);

            res.status(500).send("Contact your site administrator. Something went wrong")
        }
        else{
            
           // console.log(data);
            db = JSON.parse(data);
                                    
            //Return index of the user delete request and delete that object from the array.
            db.forEach( (e,i) => {               
                if (e.id === id){
                    
                    db.splice(i,1);                    
                }               
            });
           
           //Update dbFile with new array after the delete
           updateDbFile(db , filePath);    
                                 
            
        }

    });



}


//Return unique SD5 to create unique id and to be able to read back as a checksum for data intgrity.
function returnSD5(data){

    const x = CryptoJS.MD5(data);    
    
    return x.toString(CryptoJS.enc.Hex);
    
}

// Starts the server to begin listening
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`)); 
