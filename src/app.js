const express = require('express')
require('./db/mongoose')

const studentRouter = require('./routers/student')
const courseRouter = require('./routers/course')
const assignmentRouter = require('./routers/assignment')

const app = express()

app.use(express.json())

/************************************************************
 * 
 * 
 // server down
  app.use((req, res, next) => {
    res.status(503).send('Site is currently down. check back soon!')
  })
                                                            * 
                                                            *
*************************************************************/
app.use(studentRouter)
app.use(courseRouter)
app.use(assignmentRouter)
module.exports = app