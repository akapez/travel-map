import asyncHandler from 'express-async-handler'
import Pin from '../models/Pin.js'

//@desc     Create a pin
//@route    POST/api/pin
//@access   Private
const createPin = asyncHandler(async (req,res) => {
    const newPin = new Pin(req.body)

    const createdPin = await newPin.save()
    res.status(201).json(createdPin)
})

//@desc     Fetch all pins
//@route    GET/api/pin
//@access   Public
const getPins = asyncHandler(async (req, res) => {
    const pins = await Pin.find({})
    res.json(pins)
})

export {createPin , getPins}
