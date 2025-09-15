import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb'
import crypto from 'crypto'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import generateColors from './Auxiliary.js'

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
  'User already exists': 21003,
  21004: 'User update failed',
  'User update failed': 21004
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
    .find({}, { projection: { _id: 1, value: 1, images: 1, user: 1, replyTo: 1, isEdited: 1, timestamp: 1, ip: 1 } })
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .toArray()

    const userNames = []
    for (const message of messages) {
      if ( !userNames.includes(message.user) ) {
        userNames.push(message.user)
      }
    }
    const userList = await getUserList(userNames)

  return { messages, userList }
}

export async function getUserList(userNames) {
  const collection = await getAocCollection('users')
  const users = await collection.find({ username: { $in: userNames } }, { projection: { _id: 0, username: 1, description: 1, image: 1, location: 1, tz: 1 } }).toArray()
  const userMap = {}
  const colors = generateColors(users.length)
  for (const user of users) {
    userMap[user.username] = {...user, color: colors.pop()}
  }

  return userMap
}

export async function sendMessage(message, ip) {
  const collection = await getAocCollection('messages')
  message.timestamp = new Date()
  message.ip = ip || message.ip
  await collection.insertOne(message)
}

export async function deleteMessage(message) {
  const collection = await getAocCollection('messages')
  await collection.deleteOne({ value: message })
}

export async function editMessage(oldMessageId, newMessage) {
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

  if (!user) {
    return CODES['User not found']
  }

  if (user.password !== password) {
    return CODES['User password incorrect']
  }

  const reconstructedUser = {
    username: user.username,
    token: user.token,
    description: user.description,
    image: user.image,
    location: user.location,
    tz: user.tz
  }
  return reconstructedUser
}

export async function isTokenValid(token) {
  const collection = await getAocCollection('users')
  const user = await collection.findOne({ token: token })

  if (!user) {
    return CODES['Invalid token']
  }

  const reconstructedUser = {
    _id: user._id,
    username: user.username,
    token: user.token,
    description: user.description,
    image: user.image,
    location: user.location,
    tz: user.tz
  }
  return reconstructedUser
}

export async function registerUser(userName, password) {
  const loginCheck = await authCheck(userName, password)

  if (loginCheck !== CODES['User not found']) {
    return CODES['User already exists']
  }

  const user = {
    username: userName,
    //password: hashPassword(password)
    password: password,
    token: generateToken(userName + password),
    created: new Date(),
    lastModified: null,
    description: '',
    image: null,
    location: '',
    tz: ''
  }

  const collection = await getAocCollection('users')
  await collection.insertOne(user)

  const reconstructedUser = {
    username: user.username,
    token: user.token,
    created: user.created,
    lastModified: user.lastModified,
    description: user.description,
    image: user.image,
    location: user.location,
    tz: user.tz
  }

  return reconstructedUser
}

export async function updateUser(modifiedUser) {

  const collection = await getAocCollection('users')
  const filter = { _id: new ObjectId(modifiedUser._id) }
  const update = {
    $set: {
      username: modifiedUser.username,
      description: modifiedUser.description,
      image: modifiedUser.image,
      location: modifiedUser.location,
      tz: modifiedUser.tz,
      lastModified: new Date()
    }
  }
  try {
    await collection.updateOne(filter, update)
  } 
  catch (error) {
    return CODES['User update failed']
  }
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex')
}

function generateToken(input) {
  return crypto.createHash('sha256').update(input).digest('hex')
}
