const mongoose = reequire('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    profilePicture: {
        type: String,
    }
    });
module.exports = mongoose.model('User', userSchema);
