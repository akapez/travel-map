import asyncHandler from 'express-async-handler'
import User from '../models/User.js'

//@desc     Register a user
//@route    POST/api/users
//@access   Public
const registerUser = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body
  
  const hasFound = await User.find({
    email: new RegExp(`^${email}$`, "i"),
  })

  if (hasFound.length) {
    return res.sendStatus(422)
  }

  const user = await User.create({
    userName,
    email,
    password,
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      userName: user.userName,
      email: user.email,
    })
  } else {
    res.status(400)
    throw new Error("Invalid user data")
  }
})

//@desc     Auth user
//@route    POST/api/users/login
//@access   Public
const authUser = asyncHandler(async (req, res) => {
    const { userName, password } = req.body

    const user = await User.findOne({ userName})
  
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        userName: user.userName,
        email: user.email,
      })
    } else {
      res.status(401)
      throw new Error('Invalid userName or password')
    }
  })

export { authUser , registerUser}
