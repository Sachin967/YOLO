import { USER_BINDING_KEY } from '../config/index.js'
import AdminService from '../services/admin-service.js'
import { PublishMessage, RPCRequest, SubscribeMessage } from '../utils/index.js'
import express from 'express'
export const admin = (app, channel) => {
  const router = express.Router()
  const service = new AdminService()
  SubscribeMessage(channel, service)
  router.post('/register', async (req, res, next) => {
    try {
      const { email, password } = req.body
      const { data } = await service.AdminSignup({ email, password }, res)
      res.json(data)
    } catch (error) {
      console.log(error)
    }
  })
  router.post('/login', async (req, res, next) => {
    try {
      const { email, password } = req.body
      const { data } = await service.AdminLogin({ email, password }, res)
      res.json(data)
    } catch (error) {
      console.log(error)
    }
  })

  router.get('/getUsers', async (req, res, next) => {
    try {
      const usersResponse = await RPCRequest('USER_RPC', {
        type: 'LIST_USERS',
      })
      if (usersResponse) {
        res.json(usersResponse)
      }
    } catch (error) { }
  })

  router.get('/getposts', async (req, res, next) => {
    try {
      console.log('here')
      const postresponse = await RPCRequest('POST_RPC', {
        type: 'LIST_REPORTED_POSTS',
      })
      if (postresponse) {
        res.json(postresponse)
      }
    } catch (error) { }
  })

  router.post('/blockuser', async (req, res, next) => {
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
  router.post('/unblockuser', async (req, res, next) => {
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
  router.post('/unlistpost', async (req, res, next) => {
    try {
      console.log(req.body)
      const { postId } = req.body
      const response = await RPCRequest('POST_RPC', {
        type: 'UNLIST_POST',
        data: postId,
      })
      console.log('unlist', response)
      if (response) {
        return res.json(response)
      }
    } catch (error) {
      console.log(error)
    }
  })
  router.post('/listpost', async (req, res, next) => {
    try {
      const { postId } = req.body
      const response = await RPCRequest('POST_RPC', {
        type: 'LIST_POST',
        data: postId,
      })
      console.log('list', response)
      if (response) {
        return res.json(response)
      }
    } catch (error) {
      console.log(error)
    }
  })
  router.post('/logout', async (req, res, next) => {
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

  router.get('/userdashboard', async (req, res, next) => {
    try {
      const response = await RPCRequest('USER_RPC', {
        type: "COUNT_GENDERS"
      })
      const resp = await RPCRequest('USER_RPC',{
        type:"CATEGORIZE_BY_AGE"
      })
      if (response && resp) {
        return res.json({response,resp})
      }
    } catch (error) {

    }
  })
  router.get('/averagepostcount', async (req, res, next) => {
    try {
      const response = await RPCRequest('POST_RPC', {
        type: "POSTS_COUNT"
      })
    
      if (response) {
        return res.json({ response })
      }
    } catch (error) {

    }
  })
  app.use('/admin', router)
}
