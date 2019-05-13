// Imports
const express = require('express')
const User = require('../models/user')
const router = new express.Router()

// REST API for creating resources. Sets up routing for POST requests to retrieve user json object from client
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        // Waits for the promise that comes back when saving.
        await user.save()
        res.status(201).send(user)
        // Code only runs here if save is successful, otherwise runs catch code block.
    } catch (error) {
        res.status(400).send(error)
    }
})

// GET request endpoint for fetching all users. Refactored using async-await with try-catch statement.
router.get('/users', async (req, res) => {
    try {
        const users = await User.find( {} )
        res.send(users)
    } catch (error) {
        res.status(500).send()
    }
})

// GET request endpoint for fetching individual user by ID. Dynamic route handler.
router.get('/users/:id', async (req, res) => {
    const _id = req.params.id
    
    try {
        // Mongoose automatically converts mongodb string id into object id's
        const user = await User.findById(_id) 

        if (!user) {
            return res.status(404).send()
        }
        // If found, send back the user
        res.send(user)
    } catch (error) {
        res.status(500).send()
    }
})

// Updates a user
router.patch('/users/:id', async (req, res) => {
    // Specifies what is allowed to be updated in the db
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        // req.body lets us access the data from front-end. new: true lets us get the updated user back.
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        // If no user is found.
        if (!user) {
            return res.status(404).send()
        }

        // Sends back the found user data back after updating it
        res.send(user)

    } catch (error) {
        res.status(400).send(error)
    }
})

// Route handler for deleting resources
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router