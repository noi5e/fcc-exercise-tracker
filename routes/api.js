'use strict';

'use strict'

const ExerciseUser = require('../models/exercise-user.js')
const moment = require('moment')

module.exports = function(app) {
  app.post('/api/exercise/new-user', function(req, res) {
    const newExerciseUser = new ExerciseUser({ username: req.body.username })
    newExerciseUser.save((error, newUser) => {
      res.status(200).json(newUser)
    })
  })
  
  app.post('/api/exercise/add', function(req, res) {
    ExerciseUser.findById(req.body.userId, (error, user) => {
      user.exercises = user.exercises.concat([{
        description: req.body.description,
        duration: req.body.duration,
        date: moment(req.body.date, "YYYY-MM-DD").valueOf()
      }])
      
      user.markModified('exercises')
      user.save((error, newUser) => {
        res.status(200).json(newUser)
      })
    })
  })
  
  app.get('/api/exercise/log', function(req, res) {
    console.log('user id: ', req.query.userId)
    console.log('from: ',  req.query.from)
    console.log('to: ', req.query.to)
    
    ExerciseUser
      .findById(req.query.userId)
      .select('exercises')
      .exec((error, user) => {
        
        // console.log(moment('2019-01-13', "YYYY-MM-DD").valueOf())
      
        let exercises = user.exercises.slice(0)
        
        if (req.query.from && req.query.to) {
          exercises = exercises.filter((exercise) => {
            return exercise.date > moment(req.query.from).valueOf() && exercise.date < moment(req.query.to).valueOf()
          })
        }
          
        if (req.query.limit) {
          exercises = exercises.slice(exercises.length - req.query.limit)
        }
      
        res.status(200).json(exercises)
      })
  })
}