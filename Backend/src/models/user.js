import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  name:     { type: String, default: '' },
  avatar:   { type: String, default: '' },   // Google profile picture URL
  googleId: { type: String, default: '' },   // Google user ID
}, { timestamps: true })

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