import mongoose from "mongoose";

const PokemonSchema = new mongoose.Schema({
    id: Number,
    sprite: String,
    name: String,
    height: Number,
    weight: Number,
    base_xp: Number,
    abilities: Array,
    types: Array,
    cries: Object,
    stats: Array,
})

const Pokemon = mongoose.models.Pokemon || mongoose.model('Pokemon', PokemonSchema)
export default Pokemon