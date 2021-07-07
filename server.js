const express = require('express');

const server = express();

const userDb = require('./users/userDb.js')

const postDb = require('./posts/postDb')

server.use(express.json())
server.use(logger)

server.get('/api/users/', async (req, res) => {
  try {
    const users = await userDb.get()
    res.status(200).json(users)
  } catch(err) {
    res.status(500).json({error: err})
  }
})

server.get('/api/users/:id', async (req, res) => {
  const id = req.params.id
  try {
    const user = await userDb.getById(id)
    if(user == undefined){
      res.status(404).json({error: 'the user specified by that id does not exist'})
    } else {
    res.status(200).json(user)
    }
  } catch(err) {
    res.status(500).json({error: err})
  }
})

server.post('/api/users', async (req, res) => {
  const userInfo = req.body
  if(!userInfo.name || userInfo.name === ''){
    res.status(400).json({errorMessage: 'please provide a name for the user'})
  } else {
    try {
      const user = await userDb.insert(userInfo)
      res.status(200).json(user)
    } catch(err){
      res.status(500).json({error: 'There was an error posting the user to the database'})
    }
  }
})

server.put('/api/users/:id', async (req, res) => {
  const id = req.params.id
  const userInfo = req.body
  try{
    const user = await userDb.getById(id)
    if(user == undefined){
      res.status(404).json({error: 'the user specified by that id does not exist'})
    } else if(!userInfo.name || userInfo.name === '') {
      res.status(400).json({errorMessage: 'please provide a name for the user'})
    } else {
      const updUser = await userDb.update(id, userInfo)
      res.status(200).json({updUser})
    }
    
  } catch(err){
    res.status(500).json({error: 'There was an error updating the user in the database'})
  }
})

server.delete('/api/users/:id', async (req, res) => {
  const id = req.params.id
  try {
    const user = await userDb.getById(id)
    if(user == undefined) {
      res.status(404).json({error: 'the user specified by that id does not exist'})
    } else {
      const delUser = await userDb.remove(id)
      res.status(200).json({delUser, user})
    }
  } catch(err){
    res.status(500).json({error: err})
  }
})

server.get('/api/users/:id/posts', async (req, res) => {
  const id = req.params.id
  try {
    const user = await userDb.getById(id)
    if(user == undefined) {
      res.status(404).json({error: 'the user specified by that id does not exist'})
    } else {
    const posts = await userDb.getUserPosts(id)
    res.status(200).json({posts})
    }

  } catch(err) {
    res.status(500).json({error: err})
  }
})

server.post('/api/users/:id/posts', async (req, res) => {
  const id = req.params.id
  const postData = req.body
  try {
    const user = await userDb.getById(id)
    if(user == undefined) {
      res.status(404).json({error: 'the user specified by that id does not exist'})
    } else if(!postData.text || postData.text == '') {
      res.status(404).json({message: 'please provide text for the post'})
    } else {
      const post = await postDb.insert({...postData, user_id: id})
      res.status(200).json(post)
    }
  } catch(err){

  }
})

server.get('/', (req, res) => {
  res.status(200).json({api: 'running'})
});

//custom middleware

function logger(req, res, next) {
  const method = req.method;
  const url = req.url
  const time = new Date().toISOString()
  console.log(`method: ${method}, url: ${url}, timestamp: ${time}`)
  next()
};



module.exports = server;