const express = require('express')
const app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
require('dotenv').config()

const uri = process.env.DB

const Document = require('./models/Document')
const mongoose = require('mongoose')

mongoose.connect(uri)
app.get('/', (req, res) => {
  const code = `
  welcome to copy paste artist!
        
  use the commands in the top right
  to create a new file to share
        `

  res.render('code-display', {
    code,
    lineNumbers: code.split('\n').length,
    language: 'plaintext'
  })
})

app.get('/new', (req, res) => {
  res.render('new')
})

app.get('/:id', async (req, res) => {
  const id = req.params.id
  try {
    const document = await Document.findById(id)

    res.render('code-display', { code: document.value, id })
  } catch (e) {
    res.redirect('/')
  }
})

app.get('/:id/duplicate', async (req, res) => {
  const id = req.params.id
  try {
    const document = await Document.findById(id)
    res.render('new', { value: document.value })
  } catch (e) {
    res.redirect(`/${id}`)
  }
})

app.post('/save', async (req, res) => {
  const value = req.body.value
  try {
    const document = await Document.create({ value })
    res.redirect(`/${document.id}`)
  } catch (e) {
    res.render('new', { value })
  }
})

app.listen(process.env.PORT || 3000)
