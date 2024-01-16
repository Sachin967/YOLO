import AdminRepositary from '../database/repositary/admin-repositary.js'
import {
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
  ValidateSignature,
  FormateData,
} from '../utils/index.js'

class AdminService {
  constructor() {
    this.repositary = new AdminRepositary()
  }
  async AdminSignup({ email, password }, res) {
    try {
      let salt = await GenerateSalt()
      let adminpass = await GeneratePassword(password, salt)
      const admin = await this.repositary.AdminCreate({ email, adminpass, salt })
      await GenerateSignature(res, {
        email: email,
        _id: admin._id,
      })
      return FormateData({
        status: true,
        id: admin._id,
        email: admin.email,
      })
    } catch (error) {
      console.log(error)
    }
  }
  async AdminLogin(adminInputs, res) {
    try {
      const { email, password } = adminInputs
      const existingAdmin = await this.repositary.FindAdmin(email)

      if (existingAdmin) {
        const validPassword = await ValidatePassword(
          password,
          existingAdmin.salt,
          existingAdmin.password
        )
        if (validPassword) {
          const token = await GenerateSignature(res, {
            email: existingAdmin.email,
            _id: existingAdmin._id,
          })
          return FormateData({
            status: true,
            id: existingAdmin._id,
            email: existingAdmin.email,
          })
        } else {
          return res.json({ msg: 'Incorrect password' })
        }
      }
    } catch (error) {}
  }
//   async SubscribeEvents(payload) {
//     const { event, data } = payload
//     switch (event) {
//       case 'USERS_FETCHED':
//         console.log(data)
       
//         break

//       default:
//         break
//     }
//   }
}

export default AdminService
