let bcrypt = require('bcryptjs')
let mongoose = require('mongoose')

// Create user schema
let tagsSchema = new mongoose.Schema({
    steamId: {
        type: String
    },
    originId: {
        type: String
    },
    battleNetId: {
        type: String
    },
    epicGamesId: {
        type: String
    },
    xboxGamerTag: {
        type: String
    },
    psnId: {
        type: String
    },
    nintendoFriendCode: {
        type: String
    }
})

let creatorSchema = new mongoose.Schema({
    youTube: {
        type: String
    },
    twitch: {
        type: String
    },
    mixer: {
        type: String
    },
    twitter: {
        type: String
    },
    instagram: {
        type: String
    }
})


let userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: String,
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 6
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    pic: String,
    background: String,
    bio: String,
    admin: {
        type: Boolean,
        default: false
    },
    games: Array,
    friends: Array,
    tags: tagsSchema,
    creator: creatorSchema
})

// Hash the passwords with BCrypt 
userSchema.pre('save', function(done) {
    // Make sure it's new, as opposed to modified
    if (this.isNew) {   
        this.password = bcrypt.hashSync(this.password, 12)
    }
    // Tell it we're ok to move on (to inset into the DB)
    done()
})

// Make a JSON representation of the user (for send on the JWT payload)
userSchema.set('toJSON', {
    transform: (doc, user) => {
        delete user.password
        delete user.__v
        delete user.games
        delete user.friends
        return user
    }
})

// Make a function that compares passwords
userSchema.methods.validPassword = function (typedPassword) {
    // typedPassword: Plain text, just typed in by user
    // this.password: Existing, hashed password
    return bcrypt.compareSync(typedPassword, this.password)
}

// TODO: Export user model
module.exports = mongoose.model('User', userSchema)
