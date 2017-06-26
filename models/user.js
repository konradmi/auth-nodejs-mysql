const bcrypt = require('bcrypt-nodejs')
const Sequelize = require('sequelize')
const sequelize = new Sequelize('mysql://vagrant:vagrant@localhost:3310/test_db');

const User = sequelize.define('user', {
  login: {
  	type: Sequelize.TEXT,
  	primaryKey: true
  },
  password: Sequelize.TEXT
},{
  timestamps: false,
  hooks: {
  	beforeCreate: (user, options) => {
  	  return new Promise((resolve, reject) => {
	    bcrypt.genSalt(10, (err, salt) => {
	      if (err) { reject(err) }

	      return bcrypt.hash(user.password, salt, null, (err, hash) => {
	        if (err) { reject(err) }
	          user.password = hash
	          resolve()
	      })
	    })
	  })
  	}
  }
})

User.prototype.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return callback(err)

    callback(null, isMatch)
  })
}

module.exports = User