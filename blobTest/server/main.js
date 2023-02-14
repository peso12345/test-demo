const express = require('express')
const app = express()
const port = 9000

app.use(express.static('public'))
app.get('/',(req,res)=>{
    res.send('hello world!')
})
app.post('/',(req,res)=>{
    res.send('Got a POST request')
})

app.listen(port,()=>{
    console.log(`监听端口号${port}`);
})