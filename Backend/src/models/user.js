import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  email: {
    type:     String,
    required: [true, 'Email is required'],
    unique:   true,
    lowercase: true,
    trim:     true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email']
  },
  password: {
    type:     String,
    required: [true, 'Password is required'],
    minlength: 8,
    select:   false   // never returned by default
  },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
})

// Hash password before save
userSchema.pre('save', async function () {

  if (!this.isModified('password')) {
    return
  }

  this.password = await bcrypt.hash(
    this.password,
    12
  )
})

// Instance method — compare passwords
userSchema.methods.comparePassword = async function(candidate) {
  return bcrypt.compare(candidate, this.password)
}

export default mongoose.model('User', userSchema)