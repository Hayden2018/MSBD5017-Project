const { MongoClient } = require('mongodb')
const { ethers } = require('ethers')
var crypto = require('crypto')

const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()
app.use(cookieParser())
app.use(express.json())

const sessions = {}

const ERC20_ABI = [
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function totalSupply() view returns (uint256)'
]

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

    const provider = new ethers.providers.JsonRpcBatchProvider('https://sepolia.infura.io/v3/f7dc6979c2734c8ba8d524c9a6802cb9')

    const contractAddress = '0x96a0F1De80e2baf262DEC7940B38ABeB52Aed571'
    const contract = new ethers.Contract(contractAddress, ERC20_ABI, provider)

    const name = await contract.name()
    const symbol = await contract.symbol()
    const totalSupply = await contract.totalSupply()
    console.log([name, symbol, totalSupply])
}

main()
app.listen(5017)