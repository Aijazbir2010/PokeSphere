import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const UserSchema = new mongoose.Schema({
    userId: {type: String, default: uuidv4},
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    likedPokemons: {type: Array},
    savedPokemons: {type: Array},
    code: {type: String},
    createdAt: {type: Date, default: new Date(Date.now())},
})

const User = mongoose.models.User || mongoose.model('User', UserSchema)
export default User