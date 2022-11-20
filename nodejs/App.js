const { MongoClient } = require('mongodb')
const { ethers } = require('ethers')
const crypto = require('crypto')
const { ABI } = require('./ABI.js')

const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()
app.use(cookieParser())
app.use(express.json())

const sessions = {}

function generateWallet() {
    let privateKey = '0x' + crypto.randomBytes(32).toString('hex')
    let address = ethers.utils.computeAddress(privateKey)
    return [privateKey, address]
}

async function main() {

    const uri = 'mongodb://dapp:22fall-msbd5017@124.223.197.77:35017/mylink'
    const client = new MongoClient(uri)

    await client.connect()
    const database = client.db('mylink')
    const Users = database.collection('User')

    app.post('/register', async (req, res) => {
        const { username, password } = req.body
        let user = await Users.findOne({username: username})
        if (user != null) {
            res.status(403).json({message: 'Username already existed'})
        }
        else {
            const pwHash = crypto.createHash('sha1').update(password).digest('hex')
            let [key, address] = generateWallet()
            let record = {
                privateKey: key,
                address: address,
                username: userName,
                password: pwHash
            }
            await Users.insertOne(record)
            let token = crypto.randomBytes(8).toString('hex')
            sessions[token] = username
            res.cookie('session', token, {maxAge: 900000})
            res.status(200).json({message: 'Registration successful'})
        }
    })

    app.post('/login', async (req, res) => {
        const { username, password } = req.body
        const pwHash = crypto.createHash('sha1').update(password).digest('hex')
        let user = await Users.findOne({username: userName, password: pwHash})
        if (user == null) {
            res.status(400).json({message: 'Username or password incorrect'})
        }
        else {
            let token = crypto.randomBytes(8).toString('hex')
            sessions[token] = username
            res.cookie('session', token, {maxAge: 900000})
            res.status(200).json({message: 'Login successful'})
        }
    })

    app.get('/logout', async (req, res) => {
        res.clearCookie('session')
        res.status(200).json({message: 'Login successful'})
    })

    const password = 'password'
    const userName = 'Test-User'

    const pwHash = crypto.createHash('sha1').update(password).digest('hex')

    let [key, address] = generateWallet()

    let record = {
        privateKey: key,
        address: address,
        username: userName,
        password: pwHash
    }
    await Users.insertOne(record)

    let user = await Users.findOne({username: userName, password: pwHash})
    console.log(user)

    const provider = new ethers.providers.JsonRpcBatchProvider('https://rpc.debugchain.net')
    
    const contractAddress = '0xbfE5Fba9B2AAC73CcBedCF69592F09dE5C2536d4'
    const contract = new ethers.Contract(contractAddress, ABI, provider)

    const myAddress = '0x3E2382C8cf290591DE1FE7d981a16EC9A8d89391'
    const privateKey = '2d0afce8ad2de9cbf863bda216b1c40ded421110d743d3467813f246d443142b'
    const wallet = new ethers.Wallet(privateKey, provider)
    const contractW = contract.connect(wallet)

    const success = await contractW.mint(myAddress, 'https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg', '1kk3')
    let tok = await contractW.getToken(2)
    console.log(tok)
}

main()
app.listen(5017)