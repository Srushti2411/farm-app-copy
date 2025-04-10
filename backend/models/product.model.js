import mongoose from "mongoose";

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
    }
},
{timestamps:true}

)

const Product = mongoose.model("Product",productSchema);

export default Product;