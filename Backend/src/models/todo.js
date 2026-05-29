import mongoose from 'mongoose'

const todoSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text:      { type: String, required: true, trim: true },
  completed: { type: Boolean, default: false },
  url:       { type: String, default: '' },
  pageTitle: { type: String, default: '' },
}, { timestamps: true })

export default mongoose.model('Todo', todoSchema)