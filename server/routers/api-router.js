const express = require('express')
const apiController = require('./../controllers/api-controller.js')
const usersRouter = require('./users-router')
const router = express.Router()

router.post('/', apiController.msgGet)
router.use('/users', usersRouter)

module.exports = router