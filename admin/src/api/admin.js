import { USER_BINDING_KEY } from '../config/index.js'
import AdminService from '../services/admin-service.js'
import { PublishMessage, RPCRequest, SubscribeMessage } from '../utils/index.js'

export const admin = (app, channel) => {
  const service = new AdminService()
  SubscribeMessage(channel, service)
  app.post('/register', async (req, res, next) => {
    try {
      const { email, password } = req.body
      const { data } = await service.AdminSignup({ email, password }, res)
      res.json(data)
    } catch (error) {
      console.log(error)
    }
  })
  app.post('/login', async (req, res, next) => {
    try {
      const { email, password } = req.body
      const { data } = await service.AdminLogin({ email, password }, res)
      res.json(data)
    } catch (error) {
      console.log(error)
    }
  })

  app.get('/getUsers', async (req, res, next) => {
    try {
      const usersResponse = await RPCRequest('USER_RPC', {
        type: 'LIST_USERS',
      })
      if (usersResponse) {
        res.json(usersResponse)
      }
    } catch (error) {}
  })

    app.get('/getposts', async (req, res, next) => {
      try {
        console.log('here')
        const postresponse = await RPCRequest('POST_RPC', {
          type: 'LIST_REPORTED_POSTS',
        })
        if (postresponse) {
          res.json(postresponse)
        }
      } catch (error) {}
    })

  app.post('/blockuser', async (req, res, next) => {
    try {
      const { id } = req.body
      const blockuser = await RPCRequest('USER_RPC', {
        type: 'BLOCK_USER',
        data: id,
      })
      if (blockuser) {
        res.json(blockuser)
      }
    } catch (error) {
      console.log(error)
    }
  })
   app.post('/unblockuser', async (req, res, next) => {
     try {
       const { id } = req.body
       console.log(id)
       const unblockeduser = await RPCRequest('USER_RPC', {
         type: 'UNBLOCK_USER',
         data: id,
       })
       if (unblockeduser) {
         res.json(unblockeduser)
       }
     } catch (error) {
       console.log(error)
     }
   })
   	app.post('/logout', async (req, res, next) => {
      try {
        res.cookie('adminJwt', '', {
          httpOnly: true,
          expires: new Date(0),
        })
        res.status(200).json({ status: true, message: 'Logged out' })
      } catch (error) {
        console.log(error)
      }
    })
}
