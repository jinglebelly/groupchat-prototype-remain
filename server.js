const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Chatkit = require('@pusher/chatkit-server')
// 以上4个require，感觉正常使用，但idea提示‘unresolved function or method require（）’
const app = express()

// chatkit创建实例
const chatkit = new Chatkit.default({
    instanceLocator:'v1:us1:4ef37692-231e-428b-909f-fcbb250b7be1',
    key:'a4187aff-776f-4c9a-99f0-e45fcebbdb8d:JuvH5GCy6DIMFyRvWkSjwgnlUMEarfvxr0wLHrdBe0E=',
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

// /users route，接收上传的post并创建用户
app.post('/users',(req,res)=>{
  const {username}=req.body;
  chatkit
      .createUser({
          id:username,
          name:username
      })
      .then(()=>res.sendStatus(201))
      .catch(error=>{
        if(error.error === 'services/chatkit/user_already_exists'){
          res.sendStatus(200)
        }else{
          res.status(error.status).json(error)
        }
      })
});

const tokenExpiry = 864000

// 验证用户Id 提供TokenProvider 此处没有验证 只是形式
app.post('/authenticate',(req,res)=>{
    console.log(tokenExpiry)
  const  authData = chatkit.authenticate({userId:req.query.user_id, tokenExpiry}, {tokenExpiry})
  res.status(authData.status).send(authData.body)
});


const PORT = 3001;
app.listen(PORT, err => {
  if (err) {
    console.error(err)
  } else {
    console.log(`Running on port ${PORT}`)
  }
});
