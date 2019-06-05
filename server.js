const express = require('express');
const db = require('./data/accounts-model');
const server = express();
server.use(express.json());


// your code here for CRUD

// requires name and budget
//---------------------------------------------------------------------------------//

server.post('/', checkBudget, (req, res) => {
    const {name, budget} = req.body;
    const post = {
        name: name,
        budget: budget
    }

    db.add(post)
    .then(budget => {
        res.status(201).json({message: "Add successful!", budget});
    })
    .catch(err => {
        res.status(500).json({message: "Add FAILURE! NAME must be UNIQUE!", err});
    })

});

// Get all from db
//---------------------------------------------------------------------------------//

server.get('/', (req, res) => {

    db.find()
    .then(posts => {
        res.status(200).json({message: "Get Success!", posts});
    })
    .catch(err => {
        res.status(404).json({message: "Get FAILURE", err});
    })
});

// Update using param id and post fields
//---------------------------------------------------------------------------------//

server.put('/:id', checkBudget, checkID, (req, res) => {
    const {id} = req.params;
    const post = {
        name: req.body.name,
        budget: req.body.budget
    }

    db.update(id, post)
    .then(posts => {
        res.status(200).json({message: "Update Success!", posts});
    })
    .catch(err => {
        res.status(500).json({message: "Update FAILURE!", err});
    })

});

// Delete from db with specific id
//---------------------------------------------------------------------------------//

server.delete('/:id', checkID, (req, res) => {
    const {id} = req.params;

    db.remove(id)
    .then(count => {
        res.status(200).json({message: "DESTRUCTION IS IMMINENT.", count});
    })
    .catch(err => {
        res.status(500).json({message: "DESTRUCTION POSTPONED!", err});
    })

});


//---------------------------------------------------------------------------------//

// Check if user have required inputs

function checkBudget (req, res, next) {
    const {name, budget} = req.body;

    if (!name || !budget) {
        res.status(400).json({message: "Name or Budget is missing, please provide."});
    } else {
        next();
    }
}

//---------------------------------------------------------------------------------//

// Checks if the ID in params exists in database

function checkID (req, res, next) {
    const {id} = req.params;

    db.findById(id)
    .then(budget => {
        if (!budget) {
            res.status(404).json({message: "No budget exist with that ID."});
        } else {
            next();
        }
    })
    .catch(err => {
        res.status(500).json({message: "That ID does not exist", err})
    })
}

//---------------------------------------------------------------------------------//

module.exports = server;