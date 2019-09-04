const mongoose = require('mongoose')

const assignmentSchema = mongoose.Schema({
    description: {
        type: String, required: true, trim: true
    },
    completed: {
        type: Boolean, default: false
    },
    progress: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0 || value > 100) {
                throw new Error('progress Must be between 0 to 100')
            }
        }
    },
    stuID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Student'
    },
    relatedCourse: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Course'
    }
}, {
        timestamps: true
    })

const Assignment = mongoose.model('Assignment', assignmentSchema)

module.exports = Assignment 