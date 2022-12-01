const { MongoClient } = require('mongodb')
const { ethers } = require('ethers')
const crypto = require('crypto')
const { ABI } = require('./ABI.js')

const express = require('express')
const cookieParser = require('cookie-parser')
const md5File = require('md5-file')
const app = express()
app.use(express.static('imgs'))
app.use(cookieParser())
app.use(express.json())

const sessions = {}

const images = [
    '000035.00a8c8fa.1381881662.png',
    '000036.e4a72fae.1224387723.png',
    '000037.b135501c.3264412080.png',
    '000039.8875d369.692907428.png',
    '000040.d4587f23.3746412683.png',
    '000041.d157a0b8.87195859.png',
    '000042.802b5081.51201326.png',
    '000043.64776bba.1286397373.png',
    '000044.0f0b005e.3083524073.png',
    '000045.adad438b.729199398.png',
    '000046.8624a64d.264423718.png',
    '000047.25ce437e.1329500887.png',
    '000050.0524c67f.2198652008.png',
    '000051.491eb9c7.394301741.png',
    '000052.a3c18749.146233707.png',
    '000053.b2760c25.592155058.png',
    '000056.7ab0ca23.498609785.png',
    '000057.71f3a889.3563861815.png'
]

function generateWallet() {
    let privateKey = '0x' + crypto.randomBytes(32).toString('hex')
    let address = ethers.utils.computeAddress(privateKey)
    return [privateKey, address]
}

async function main() {

    const provider = new ethers.providers.JsonRpcBatchProvider('https://rpc.debugchain.net')
    
    const contractAddress = '0x2B92f9fB9d3C8c1f0E371f6B0f0f1216116d0859'
    const contract = new ethers.Contract(contractAddress, ABI, provider)

    const privateKey = '2d0afce8ad2de9cbf863bda216b1c40ded421110d743d3467813f246d443142b'
    const ownerWallet = new ethers.Wallet(privateKey, provider)
    const contractOwner = contract.connect(ownerWallet)

    const uri = 'mongodb://dapp:22fall-msbd5017@124.223.197.77:35017/mylink'
    const client = new MongoClient(uri)

    await client.connect()
    const database = client.db('mylink')
    const Users = database.collection('User')

    // for local debug
    app.all('*', (req, res, next) => {
        var origin = req.headers.origin
        res.header('Access-Control-Allow-Origin', origin)
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, token')
        res.header('Access-Control-Allow-Credentials', true)
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, DELETE')
        next()
    })

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
                username: username,
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
        let user = await Users.findOne({username: username, password: pwHash})
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
        res.status(200).json({message: 'Logout successful'})
    })

    app.get('/nft/view', async (req, res) => {
        const s = req.cookies['session']
        const username = sessions[s]
        if (username) {
            let user = await Users.findOne({username: username})
            let result = await contract.allTokenOfOwner(user.address)
            let out = []
            result.forEach(r => {
                out.push({
                    tokenId: r.id,
                    md5: r.md5,
                    url: r.url
                })
            })
            res.status(200).json(out)
        }
        else {
            res.status(401).json({error: 'Invalid session token'})
        }
    })

    app.post('/nft/transfer', async (req, res) => {
        const receiver = req.body.address
        const tokenId = req.body.tokenId
        const s = req.cookies['session']
        const username = sessions[s]
        if (username && receiver) {
            let user = await Users.findOne({username: username})
            let wallet = new ethers.Wallet(user.privateKey, provider)
            let contractW = contract.connect(wallet)
            await contractW.transferFrom(user.address, receiver, tokenId)
            res.status(200).json({message: 'Success'})
        }
        else {
            res.status(401).json({error: 'Invalid session token or receiver'})
        }
    })

    app.get('/nft/mint', async (req, res) => {
        const s = req.cookies['session']
        const username = sessions[s]
        if (username) {
            let user = await Users.findOne({username: username})
            let img = images[Math.floor(Math.random() * 18)]
            let md5 = md5File.sync('imgs/' + img)
            await contractOwner.mint(user.address, 'localhost:5017/' + img, md5)
            res.status(200).json({message: 'Mint successful'})
        }
        else {
            res.status(401).json({error: 'Invalid session token or address'})
        }
    })
}

main()
app.listen(5017)
console.log('Server started')