const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Course = require('../models/course')
const Assignmet = require('../models/assignments')

const studentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('invalid Email')
      }
    }
  },
  grade: {
    type: Number,
    default: 1,
    validate(value) {
      if (value < 0) {
        throw new Error('Age Must be a postive number')
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("invalid password")
      }

    }

  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]

}, {
    timestamps: true
  })
// virtual Relation to populate for Student , courses
studentSchema.virtual('MyCourses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'stuID'
})
// virtual Relation to populate for student , assignments
studentSchema.virtual('MyAssignments', {
  ref: 'Assignment',
  localField: '_id',
  foreignField: 'stuID'
})

//public profile
studentSchema.methods.toJSON = function () {
  const student = this
  const studentObject = student.toObject()

  delete studentObject.password
  delete studentObject.tokens


  return studentObject
}

//auth
studentSchema.methods.generateAuthToken = async function () {
  const student = this
  const token = jwt.sign({ _id: student._id.toString() }, process.env.JWT_SECRET)

  student.tokens = student.tokens.concat({ token })
  student.save()

  return token
}

//credentials
studentSchema.statics.findByCredentials = async (email, password) => {

  const student = await Student.findOne({ email })
  if (!student) {
    throw new Error('unable to login')
  }

  const isMatch = await bcrypt.compare(password, student.password)

  if (!isMatch) {
    throw new Error('unable to login')
  }

  return student
}

//hash the plain text password before saving
studentSchema.pre('save', async function (next) {
  const student = this


  if (student.isModified('password')) {
    student.password = await bcrypt.hash(student.password, 8)

  }

  next()
})

// Delete User Tasks when user deleted
studentSchema.pre('remove', async function (next) {
  const student = this

  await Assignmet.deleteMany({ stuID: student._id })
  await Course.deleteMany({ stuID: student._id })

  next()
})

const Student = mongoose.model('Student', studentSchema)


module.exports = Student