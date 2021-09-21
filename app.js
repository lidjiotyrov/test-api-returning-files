const express = require('express')
const fs = require("fs");
const app = express()
const port = 3000

app.get('/file1', (req, res) => {
  fs.readFile('./File1', (e, data) => res.send(data))

})
app.get('/file2', (req, res) => {
  fs.readFile('./File2', (e, data) => res.send(data))
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})