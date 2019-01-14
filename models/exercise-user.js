const mongoose = require('mongoose')

const ExerciseUserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  exercises: []
})

const ExerciseUser = module.exports = mongoose.model('ExerciseUser', ExerciseUserSchema)