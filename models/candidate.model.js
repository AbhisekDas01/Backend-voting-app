const mongoose = require('mongoose');

const {Schema  , model} = mongoose;

const candidateSchema = new Schema({

    name:{
        type: String,
        required: true
    },
    party:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    votes:[
        {
            user:{
                type: Schema.Types.ObjectId, //refrecne to usermodel
                ref: 'User',
                required: true
            },
            votedAt:{
                type: Date,
                default: Date.now
            }
        }
    ],
    voteCount:{
        type: Number,
        default: 0
    }

});


const Candidate = model('Candidate' , candidateSchema);
module.exports = Candidate;
