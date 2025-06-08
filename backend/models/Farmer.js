import mongoose from 'mongoose';

const { Schema } = mongoose;

const farmerSchema = new Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  isCertified: { type: Boolean, default: false },  // Certification field
  products: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product'  // Reference to Product model
  }]
}, {
  timestamps: true  // Optional: Automatically adds createdAt and updatedAt timestamps
});

const Farmer = mongoose.model('Farmer', farmerSchema);

export default Farmer;
