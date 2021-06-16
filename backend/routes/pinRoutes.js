import express from 'express'
const router = express.Router()

import {createPin, getPins} from '../controllers/pinController.js'

router.route('/').get(getPins).post(createPin)

export default router
