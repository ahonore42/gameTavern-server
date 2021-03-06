require('dotenv').config()
let db = require('../models')
let router = require('express').Router()
let jwt = require('jsonwebtoken')

// POST /auth/login (find and validate user; send token)
router.post('/login', (req, res) => {
  console.log(req.body)
  // Look up the user by their email
  db.User.findOne({ email: req.body.email })
  .then(user => {
    // Check whether the user exists
    if (!user) {
      // If they don't have an account, send an error message
      return res.status(404).send({ message: 'User was not found!' })
    }

    // They exist, but make sure they have a correct password
    if (!user.validPassword(req.body.password)) {
      // Incorrect password, send error back
      return res.status(401).send({ message: 'Invalid credentials' })
    }

    // We have a good user - make them a new token, send it to them
    let token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 8 // 8 hours, in seconds
    })

    res.send({ token })

  })
  .catch(err => {
    console.log('Error in POST /auth/login', err)
    res.status(503).send({ message: 'Server-side or DB error' })
  })

})

router.put('/gamesAdd', (req, res) => {
  console.log(req.body)
  // Look up the user by their email
  db.User.findOne({ email: req.body.email })
  .then(user => {
    console.log(req.body.name)
   user.games.push(req.body.name)
   user.save()
  })
  .catch(err => {
    console.log(err)
  })

})

router.get('/allUsers', (req, res) => {
  console.log('get users')
  // Look up the user by their email
  db.User.find({})
  .then(users => {
     console.log(users)
     res.send(users)
  })
  .catch(err => {
    console.log(err)
  })
})

router.put('/friendAdd', (req, res) => {
  console.log(req.body)
  // Look up the user by their email
  db.User.findOne({ email: req.body.email })
  .then(user => {
  console.log(req.body.friendName)
   user.friends.push(req.body.friendName)
   user.save()
  })
  .catch(err => {
    console.log(err)
  })

})

router.put('/gamesRemove', (req, res) => {
  console.log(req.body)
  // Look up the user by their email
  db.User.findOne({ email: req.body.email })
  .then(user => {
    console.log(req.body.gameId)
    for(let i = 0; i < user.games.length; i++) {
      if (user.games[i] === req.body.name) {
        user.games.splice(i ,1)
      }
    }
   user.save()
  })
  .catch(err => {
    console.log(err)
  })

})

router.get('/userGames/:id', (req, res) => {
  // Look up the user by their email
  db.User.findOne({username: req.params.id})
  .then(user => {
     console.log(user)
     res.send(user.games)
  })
  .catch(err => {
    console.log(err)
  })
})

router.get('/userFriends/:id', (req, res) => {
  console.log()
  // Look up the user by their email
  db.User.findOne({username: req.params.id})
  .then(user => {
     console.log(user.friends)
     res.send(user.friends)
     
  })
  .catch(err => {
    console.log(err)
  })
})

router.get('/userView/:id', (req, res) => {
  console.log()
  // Look up the user by their email
  db.User.findOne({username: req.params.id})
  .then(user => {
     console.log(user)
     res.send(user)
     
  })
  .catch(err => {
    console.log(err)
  })
})





// POST to /auth/signup (create user; generate token)
router.post('/signup', (req, res) => {
  console.log(req.body)
  // Make sure the user is not a duplicate
  // Look up the user by email to be sure they are new
  db.User.findOne({ email: req.body.email })
  .then(user => {
    // If the user exists already then do NOT let them create another account
    if (user) {
      // No no! Sign up instead!
      return res.status(409).send({ message: 'Email address in use'})
    }
    // We know the user is legitimately a new user: CREATE THEM!
    db.User.create(req.body)
    .then(newUser => {
      // Yay! Things worked and user exists now!
      // Create a token for the new user
      let token = jwt.sign(newUser.toJSON(), process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 8 // 8 hours, in seconds
      })

      res.send({ token })
    })
    .catch(err => {
      console.log('Error creating user', err)
      if (err.nam === 'ValidationError') {
        res.status(412).send({ message: `Validation Error ${err.message}` })
      }
      else {
        console.log('Error', err)
        res.status(500).send({ message: 'Error creating user' })
      }
    })
  })
  .catch(err => {
    console.log('ERROR IN POST /auth/signup')
    res.status(503).send({ message: 'Database or server error' })
  })
})

router.put('/edit', (req, res) => {
  console.log(req.body)
  // Look up the user by their email
  db.User.findOne({ email: req.body.email })
  .then(user => {
    console.log(req.body.name)
   user.push(req.body)
   user.save()
  })
  .catch(err => {
    console.log(err)
  })

})


module.exports = router
