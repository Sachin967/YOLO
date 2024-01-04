import Admin from '../model/adminModel.js'

class AdminRepositary {
  async AdminCreate({ email, adminpass, salt }) {
    try {
      const admin = new Admin({
        email,
        password: adminpass,
        salt,
      })
      const result = await admin.save()
      return result
    } catch (error) {
      console.log(error)
    }
  }
  async FindAdmin(email) {
    try {
      const existingAdmin = await Admin.findOne({ email })
      return existingAdmin
    } catch (error) {
      console.log(error)
    }
  }
}

export default AdminRepositary
