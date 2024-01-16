import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 as uuid4 } from 'uuid'
import {
  APP_SECRET,
  MESSAGE_BROKER_URL,
  EXCHANGE_NAME,
  QUEUE_NAME,
  USER_BINDING_KEY,
  ADMIN_BINDING_KEY,
} from '../config/index.js'
import amqplib from 'amqplib'
export const GenerateSalt = async () => {
  return await bcrypt.genSalt()
}

export const GeneratePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt)
}

export const ValidatePassword = async (enteredPassword, salt, savedPassword) => {
  return (await GeneratePassword(enteredPassword, salt)) === savedPassword
}

export const GenerateSignature = async (res, payload) => {
  try {
    const token = await jwt.sign(payload, APP_SECRET, { expiresIn: '30d' })
    // Set the JWT token as a cookie
    res.cookie('adminJwt', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV !== 'dev',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })

    return token
  } catch (error) {
    console.log(error)
    return error
  }
}

export const ValidateSignature = async (req) => {
  try {
    const signature = req.get('Authorization')
    const payload = await jwt.verify(signature.split(' ')[1], APP_SECRET)
    req.user = payload
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}

export const FormateData = async (data) => {
  if (data) {
    return { data }
  } else {
    throw new Error('Data Not found!')
  }
}
let amqplibConnection = null
const getChannel = async () => {
  if (amqplibConnection === null) {
    amqplibConnection = await amqplib.connect(MESSAGE_BROKER_URL)
  }
  return await amqplibConnection.createChannel()
}

export const CreateChannel = async () => {
  try {
    const channel = await getChannel()
    await channel.assertExchange(EXCHANGE_NAME, 'direct', false)
    return channel
  } catch (error) {
    throw error
  }
}

// publish messages
export const PublishMessage = async (channel, binding_key, message) => {
  try {
    await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message))
    console.log('Message has been sent' + message)
  } catch (error) {
    throw error
  }
}

// subscribe messages
export const SubscribeMessage = async (channel, service,adminCallback) => {
  const appQueue = await channel.assertQueue(QUEUE_NAME)

  channel.bindQueue(appQueue.queue, EXCHANGE_NAME, ADMIN_BINDING_KEY)

  channel.consume(appQueue.queue, async (data) => {
    if (data.content) {
      console.log('received data in Admin')
      console.log(data.content.toString())
      const result = await service.SubscribeEvents(data.content.toString())
      adminCallback(result)
      channel.ack(data)
    }
  })
}

const requestData = async (RPC_QUEUE_NAME, requestPayload, uuid) => {
  try {
    const channel = await getChannel()

    const q = await channel.assertQueue('', { exclusive: true })

    channel.sendToQueue(RPC_QUEUE_NAME, Buffer.from(JSON.stringify(requestPayload)), {
      replyTo: q.queue,
      correlationId: uuid,
    })

    return new Promise((resolve, reject) => {
      // timeout n
      const timeout = setTimeout(() => {
        channel.close()
        resolve('API could not fullfil the request!')
      }, 8000)
      channel.consume(
        q.queue,
        (msg) => {
          if (msg.properties.correlationId == uuid) {
            resolve(JSON.parse(msg.content.toString()))
            clearTimeout(timeout)
          } else {
            reject('data Not found!')
          }
        },
        {
          noAck: true,
        }
      )
    })
  } catch (error) {
    console.log(error)
    return 'error'
  }
}

export const RPCRequest = async (RPC_QUEUE_NAME, requestPayload) => {
  const uuid = uuid4() // correlationId
  return await requestData(RPC_QUEUE_NAME, requestPayload, uuid)
}