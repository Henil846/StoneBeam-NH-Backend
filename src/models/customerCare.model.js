const mongoose = require('mongoose');

const customerCareSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        lowercase: true,
        required: true,
        trim: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    subject:{
        type: String,
        required: true,
    },
    message:{
        type: String,
        required: true,
    }
});

const customerCareModel = mongoose.model('CustomerCare', customerCareSchema);

module.exports = customerCareModel;