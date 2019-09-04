const express = require('express')
const Student = require('../models/student')
const auth = require('../middleware/auth')

const router = new express.Router()

//save a student
router.post('/students', async (req, res) => {
    const student = new Student(req.body)

    try {

        await student.save();

        const token = await student.generateAuthToken()

        res.status(201).send({ student: student, token })
    } catch (error) {
        res.status(400).send(error)
    }

})

//student login 
router.post('/students/login', async (req, res) => {

    try {
        const student = await Student.findByCredentials(req.body.email, req.body.password)
        const token = await student.generateAuthToken()
        res.send({ user: student, token })
    } catch (error) {
        res.status(400).send(error)
    }

})
//logout 
router.post('/students/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send('Opreation Done Successfully...')
    } catch (error) {
        res.status(500).send(error)
    }
})

//logout all
router.post('/students/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.send('Opreation Done Successfully...')
    } catch (error) {
        res.status(500).send(error)
    }
})


//fetch Student profile  
router.get('/students/me', auth, async (req, res) => {
    res.send(req.user)
})


//update Student
router.patch('/students/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'grade']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Updates' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save()
        res.send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
})

//delete a Student
router.delete('/students/me', auth, async (req, res) => {
    try {

        await req.user.remove()

        res.send(req.user)
    } catch (error) {
        res.status(500).send()
    }
})



module.exports = router