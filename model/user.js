let mongoose = require('mongoose')
// var autoIncrement = require('mongoose-auto-increment');
let userSchema = new mongoose.Schema({
  Username:{
    type:String,
    required:true,
    trim:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true
  },
  Avatar:{
    type:String,
    default:""
  }
},
{timestamps:true})

// autoIncrement.initialize(mongoose.connection);
// userSchema.plugin(autoIncrement.plugin, 'Counter');
// var Counter = mongoose.model('Counter', userSchema);

module.exports = mongoose.model('user', userSchema);


