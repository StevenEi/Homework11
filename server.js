// originally had a separate routes folder with routers and router.use statements in this file but it seemed 
// unnecessary because of how few routes there were so I left all of the routes in the index.js file in routes

// boilerplate middleware code
const fs = require("fs")
const { randomUUID } = require('crypto');
const express = require('express');
const { fstat } = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3000;
const app = express();
const database = require("./db/db.json");
const { json } = require("express");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// accesses the db.json file 
app.get("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", "utf8", function (err, results) {
        if (err) {
            throw err
        }
        else {
            var parsed = JSON.parse(results)
            res.json(parsed)
        }
    })
})

// performs a post request using data from the user and saves it in the database
app.post("/api/notes", (req, res) => {
    const { title, text } = req.body
    const newNote = {
        title,
        text,
        id: randomUUID(),
    }
    console.log("new note from frontend", newNote)
    //database.unshift(newNote)
    fs.readFile("./db/db.json", "utf8", function (err, results) {
        if (err) {
            throw err
        }
        else {

            var parsed = JSON.parse(results)
            parsed.unshift(newNote)
            fs.writeFile("./db/db.json", JSON.stringify(parsed), function (err) {
                if (err) {
                    throw err
                }
                else {
                    console.log("New note added to " + `${parsed}`)
                }
            })
            res.json(database)
        }
    })

})

app.delete("/api/notes/:id", (req, res) => {
    
    fs.readFile("./db/db.json", "utf8", function (err, results) { 
        const otherIDs = [];
        var database = JSON.parse(results)
        for (let i = 0; i < database.length; i++) {
            if (req.params.id === database[i].id) {
            }
            else {
                otherIDs.push(database[i])
            }
        }
        fs.writeFile("./db/db.json", JSON.stringify(otherIDs), function (err) {
            if (err) {
                throw err
            }
            else {
                console.log("New note added to " + `${otherIDs}`)
            }
        })
        res.json(otherIDs)
    })
   
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