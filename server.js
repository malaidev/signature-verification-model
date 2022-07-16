const express = require('express')
const bodyParser = require('body-parser')
const { getSignatureFromPrivateKey } = require("./utils/sign");

require('dotenv').config()

const app = express()
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.get('/signature-request', function (req, res) {
  const signatureInfo = getSignatureFromPrivateKey(process.env.SIGNER_PRIVATE_KEY, ...req.query.params)
  res.json(signatureInfo)
})

app.listen(3000)
console.log('Listening to localhost:3000...');