const express = require('express')
const Assignment = require('../models/assignments')
const router = new express.Router()
const auth = require('../middleware/auth')
const mongoose = require('mongoose')
const Course = require('../models/course')
//save a assignment
router.post('/assignments', auth, async (req, res) => {
    console.log(mongoose.Types.ObjectId(req.body.courseID))
    if (!req.body.courseID) {
        return res.status(400).send('invalid Creation')
    }
    const _courseID = req.body.courseID
    delete req.body.courseID
    const assignment = new Assignment({
        ...req.body,
        stuID: req.user._id,
        relatedCourse: mongoose.Types.ObjectId(_courseID)
    })

    if (assignment.completed === true) {
        assignment.progress = 100
    }
    try {
        await assignment.save()
        await Course.updateCourseProgressRatio(_courseID)
        res.status(201).send(assignment)

    } catch (error) {

        res.status(400).send(error)

    }
})



//fetch all Assignments and use query options
router.get('/assignments/me', auth, async (req, res) => {
    const match = {}
    const sort = {}
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try {

        const r = await req.user.populate({
            path: 'MyAssignments',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        //console.log(req.user.MyAssignments, r)
        res.send(req.user.MyAssignments)

    } catch (error) {
        res.status(500).send(error)

    }

})


//fetch single Assignment
router.get('/assignments/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {

        const assignmet = await Assignment.findOne({ _id, stuID: req.user._id })

        console.log(assignmet)
        if (!assignmet) {
            return res.status(404).send()
        }
        res.send(assignmet)

    } catch (error) {
        res.status(500).send(error)
    }
})


//update Assignment
router.patch('/assignments/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed', 'progress']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {

        const assignment = await Assignment.findOne({ _id: req.params.id, stuID: req.user._id })

        if (!assignment) {
            return res.status(404).send()
        }

        updates.forEach((update) => assignment[update] = req.body[update])

        if (req.body['completed'] === "true") {
            assignment['progress'] = 100
        }
        if (req.body['progress'] === "100") {
            assignment['completed'] = true
        }
        await assignment.save()
        await Course.updateCourseProgressRatio(assignment.relatedCourse)



        res.send(assignment)
    } catch (e) {
        res.status(400).send(e)
    }
})

//delete a Assignment
router.delete('/assignments/:id', auth, async (req, res) => {
    try {
        const assignment = await Assignment.findOneAndDelete({ _id: req.params.id, stuID: req.user.id })
        if (!assignment) {
            return res.status(404).send()
        }

        res.send(assignment)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router