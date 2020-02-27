const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		lowercase: true,
		unique: true,
		required: true,
    trim: true,
    validate: {
			isAsync: false,
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
	},
	password: {
		type: String,
		required: true
	},
	profile: {
		firstName: {
			type: String,
      trim: true
		},
		lastName: {
			type: String,
      trim: true
		}
	},
	access:{
		//access can be revoked by admin
		type: String,
		required: true,
		default: 'auth'
	},
	//can have many tokens
	tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
  }]
}, {
	timestamps: true,
	usePushEach: true
});

UserSchema.methods.toJSON = function () {
	var user = this;
	var userObject = user.toObject();
	//to include only id & email in the returned data
	//console.log(userObject);
	return _.pick(userObject, ['_id', 'email']);
}

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();
  user.tokens.push({access, token});
  return user.save().then(() => {
    return token;
  });
};

//Method type differ by above instance method as in
//Model methods are called on Schema ..i.e UserCollection, while instance methods
//are called on an instance of Model..i.e one specified user we have info about
UserSchema.statics.findByToken = function (token) {
	var User = this;
	var decoded;
	try {
		decoded = jwt.verify(token, process.env.JWT_SECRET);
	} catch (e) {
		return Promise.reject();
	}
	//Todo: I want to make sure that a user doesn't try to login with a token
	//token that might have been created for something else.

	//I have used projections in findOne to limit the data
	//returned by database.. i.e second argument in find one
	return User.findOne({
    '_id': decoded._id,
		'access': 'auth',
		'tokens':{ $elemMatch: {'access' : 'auth', token}},
  },{access: 0, tokens:0, createdAt: 0, updatedAt: 0, password:0, __v: 0});
};

UserSchema.statics.findByCredentials = function (email, password) {
	var User = this;
	return User.findOne({email}).then((user) =>{
		if(!user){
			return Promise.reject(404);
		}

		return new Promise((resolve, reject) => {
			if(user.access === 'auth'){
				bcrypt.compare(password, user.password, (err, res) =>{
					if(res){
						resolve(user);
					}else{
						reject(401);
					}
				});
			}else{
				reject(403);
			}
		});
	});
};

UserSchema.pre('save', function (next) {
		var user = this;
		if(user.isModified('password')){
			bcrypt.genSalt(10, (err, salt) =>{
				bcrypt.hash(user.password, salt, (err, hash) => {
					user.password = hash;
					next();
				})
			})
		}else{
			next();
		}
})


//module.exports = mongoose.model('User', User);
//ES6
var User = mongoose.model('User', UserSchema);
module.exports = {User};
