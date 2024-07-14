import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
    img: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    inStock: {
        type: Boolean,
        default: true,
    },
});

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        desc: {
            type: String,
            required: true,
        },
        categories: {
            type: Array,
            required: true,
        },
        variants: [variantSchema],
    },
    { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
