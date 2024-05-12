import mongoose from 'mongoose'

const planetSchema = new mongoose.Schema({
  keplerName: {
    type: String,
    required: true,
  },
})

// Connects planetSchema with the "planets" collection
export const Planet = mongoose.model('Planet', planetSchema)
