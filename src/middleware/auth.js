const jwt = require('jsonwebtoken')
const Student = require('../models/student')

const auth = async (req, res, next) => {
    //  console.log('Auth middleware')
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        //console.log(token)
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const student = await Student.findOne({
            _id: decoded._id,
            'tokens.token': token
        })
        if (!student) {
            throw new Error()
        }

        req.token = token
        req.user = student
        next()
    } catch (error) {
        res.status(401).send({ error: 'Please authentication' })
    }
}


module.exports = auth