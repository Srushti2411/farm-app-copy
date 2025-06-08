import mongoose from "mongoose";
import Farmer from './Farmer.js';


const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
    },
    price:{
        type:Number,
        required: true,
    },
    image:{
        type: String,
        required: true,
    },
    unit:{
        type:String,
        required: true,
        enum:["kg","pound","liter","dozens","tons"],
        default:"kg"
    },
    categories: {
        type: String,
        required: true,
        enum: ["fruits", "grains", "vegetables"]
    },
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farmer', // This references the Farmer model
      }
},
{timestamps:true}

)

const Product = mongoose.model("Product",productSchema);

export default Product;