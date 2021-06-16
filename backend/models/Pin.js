import mongoose from 'mongoose'

const pinSchema = mongoose.Schema(
  {
    userName: String,
    title: String,
    description: String,
    rating: Number,
    lat: Number,
    long: Number
  },
  {
    timestamps: true,
  }
)

const Pin = mongoose.model("Pin", pinSchema)

export default Pin
