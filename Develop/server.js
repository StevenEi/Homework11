// originally had a separate routes folder with routers and router.use statements in this file but it seemed 
// unnecessary because of how few routes there were so I left all of the routes in the index.js file in routes

// boilerplate middleware code
const { randomUUID } = require('crypto');
const express = require('express');
const path = require('path');
const PORT = process.env.port || 3000;
const app = express();
const database = require("./db/db.json")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// accesses the db.json file 
app.get("/api/notes", (req, res) => {
    console.log("JSON data from notes", res)
    res.json(database) 
  })

// performs a post request using data from the user and saves it in the database
app.post("/api/notes", (req, res) => {
    console.log("requested data", req.body)
    const {title, text} = req.body
        const newNote = {
            title,
            text,
            note_id: randomUUID(),
        }
     console.log("heres the new note", newNote)
     database.unshift(newNote)
    // call some note function from index.js?
})

app.delete("/api/notes:id", (req,res) => {
    for (let i = 0; i < database.length; i++) {
        if (req.body.note_id === database[i].note_id) {
            // delete the note?
        }
    }
})

// sends the notes.html file when you go to http://localhost:(port#)/notes
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/notes.html"))
  })
  
// sends the index.html file when you go to http://localhost:(port#)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "public/index.html"))
  })

app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`));
