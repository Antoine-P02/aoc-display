import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb'
import crypto from 'crypto'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const db_password = process.env.VITE_DB_PASSWORD
const uri = `mongodb+srv://dbP02:${db_password}@clusterp02.arl21aq.mongodb.net/?retryWrites=true&w=majority&appName=ClusterP02`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const CODES = {
  21000: 'User not found',
  'User not found': 21000,
  21001: 'User password incorrect',
  'User password incorrect': 21001,
  21002: 'Invalid token',
  'Invalid token': 21002,
  21003: 'User already exists',
  'User already exists': 21003
}

export async function closeConnection() {
  try {
    await client.close()
    console.log('MongoDB connection closed')
  } 
  catch (error) {
    console.error('Error closing MongoDB connection:', error)
  }
}

export async function getAocCollection(collectionName) {
  if (client.topology?.isConnected() !== true) {
    await client.connect()
  }
  const db = client.db('aoc')
  return db.collection(collectionName)
}

export async function getLastMessages(limit, skip) {
  const collection = await getAocCollection('messages')
  const messages = await collection
    .find({}, { projection: { _id: 1, value: 1, images: 1, isEdited: 1, timestamp: 1, ip: 1 } })
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .toArray()
  return messages
}

export async function sendMessage(message, ip) {
  const collection = await getAocCollection('messages')
  message.timestamp = new Date()
  message.ip = ip || message.ip
  await collection.insertOne(message)
  res.status(200).send('Message sent')
}

export async function deleteMessage(message) {
  const collection = await getAocCollection('messages')
  await collection.deleteOne({ value: message })
  console.log(`Message deleted: ${message}`)
}

export async function editMessage(oldMessageId, newMessage) {
  console.log('Editing message with ID:', oldMessageId, newMessage)

  const collection = await getAocCollection('messages')

  await collection.updateOne(
    { _id: new ObjectId(oldMessageId) },
    {
      $set: {
        value: newMessage.value,
        images: newMessage.images,
        isEdited: newMessage.isEdited
      }
    }
  )
}

export async function authCheck(userName, password) {
  const collection = await getAocCollection('users')
  const user = await collection.findOne({ username: userName })
  console.log('Verifying if user exists:', user)
  if (!user) {
    console.log('User not found')
    return CODES['User not found']
  }
  console.log('Verifying user password:', user.password)
  if (user.password !== password) {
    console.log('User password incorrect')
    return CODES['User password incorrect']
  }
  return user.token
}

export async function isTokenValid(token) {
  const collection = await getAocCollection('users')
  const user = await collection.findOne({ token: token })
  console.log('isTokenValid user:', user)
  if (!user) {
    return CODES['Invalid token']
  }
  return user.username
}

export async function registerUser(userName, password) {
  const loginCheck = await authCheck(userName, password)
  console.log('registerUser loginCheck:', loginCheck)
  if (loginCheck !== CODES['User not found']) {
    console.log('Register', CODES['User already exists'])
    return CODES['User already exists']
  }

  const user = {
    username: userName,
    //password: hashPassword(password)
    password: password,
    token: generateToken(userName + password),
    description: '',
    image: null,
    location: '',
    tz: ''
  }

  const collection = await getAocCollection('users')
  await collection.insertOne(user)
  console.log('about to return user:', user)
  return user
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex')
}

function generateToken(input) {
  return crypto.createHash('sha256').update(input).digest('hex')
}
