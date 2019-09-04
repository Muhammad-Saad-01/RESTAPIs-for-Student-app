const express = require('express')
const Course = require('../models/course')
const router = new express.Router()
const auth = require('../middleware/auth')
const Assignment = require('../models/assignments')
const mongoose = require('mongoose')
//save a Course for authntecated Student
router.post('/courses/add', auth, async (req, res) => {

    const course = new Course({
        ...req.body,
        stuID: req.user._id
    })
    try {
        await course.save()
        res.status(201).send(course)

    } catch (error) {
        await course.save()
        res.status(400).send(error)

    }
})



//fetch all Courses and use query options 
router.get('/courses/me', auth, async (req, res) => {
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
        console.log(req.user)
        await req.user.populate({
            path: 'MyCourses',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        console.log(req.user.MyCourses)
        res.send(req.user.MyCourses)

    } catch (error) {
        res.status(500).send(error)

    }

})

//save Course Assignment
router.post('/courses/:id/assignments', auth, async (req, res) => {


    const _courseID = req.params.id

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
//fetch all Assignments for a course and use query options 
router.get('/courses/:id/assignments', auth, async (req, res) => {

    const id = req.params.id
    let completed = 'No Complete Option'

    if (req.query.completed) {
        completed = req.query.completed === 'true'
    }

    try {
        const assignments = await Course.getCourseAssignments(id, completed)
        res.send(assignments)
    } catch (error) {
        res.status(500).send(error)
    }

})


//fetch single course by id
router.get('/courses/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {

        const course = await Course.findOne({ _id, stuID: req.user._id })
        if (!course) {
            return res.status(404).send()
        }

        res.send(course)

    } catch (error) {
        res.status(500).send(error)
    }
})


//update course by
router.patch('/courses/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'completed', 'tags']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        const course = await Course.findOne({ _id: req.params.id, stuID: req.user._id })
        console.log('step 1... ', course)
        if (!course) {
            return res.status(404).send()
        }

        updates.forEach((update) => course[update] = req.body[update])

        console.log('step 2... ', course)


        if (req.body['completed'] === "true") {
            course['progress'] = 100
            console.log('step 3 before... ', course)
            await Course.courseComplete(req.params.id)
            console.log('step 3 after ... ', course)
        }
        if (req.body['progress'] === "100") {
            course['completed'] = true
            console.log('step 4 before... ', course)
            await Course.courseComplete(req.params.id)
            console.log('step 4 after ... ', course)
        }

        console.log('step 5 before ... ', course)
        await Course.courseComplete(req.params.id)
        console.log('step 5 after ... ', course)
        await course.save()
        console.log('step 6 after ... ', course)


        res.send(course)
    } catch (e) {
        res.status(400).send(e)
    }
})

//delete a Task
router.delete('/courses/:id', auth, async (req, res) => {
    try {
        const course = await Course.findOne({ _id: req.params.id, stuID: req.user.id })
        if (!course) {
            return res.status(404).send()
        }
        console.log(course)
        await Course.deleteAllRelatesAssignments(req.params.id)
        await course.remove()
        console.log(course)
        res.send(course)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router