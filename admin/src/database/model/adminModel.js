import mongoose from 'mongoose'

const AdminSchema = new mongoose.Schema({
  email: { type: String },
  salt: { type: String },
  password: { type: String },
})

const Admin = mongoose.model('admin', AdminSchema)

export default Admin
