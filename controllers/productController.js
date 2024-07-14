import Product from "../models/productModel.js";
import { Types } from "mongoose";
let {ObjectId} = Types;
export const getProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            {
                $unwind: '$variants', // Unwind the variants array
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    desc: 1,
                    categories: 1,
                    'variantId': '$variants._id',
                    'size': '$variants.size',
                    'color': '$variants.color',
                    'price': '$variants.price',
                    'inStock': '$variants.inStock',
                    'img': '$variants.img',
                },
            },
        ]);

        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};


export const createProduct = async (req, res) => {
    const { title, desc, categories, variants } = req.body;

    try {
        const product = await Product.create({
            title,
            desc,
            categories,
            variants,
        });

        const createdProduct = await product.save();
        if(createdProduct){
            return res.status(200).send({message:"Product added Successfully",success:true});
        }
    } catch (error) {
        return res.status(500).json({ message: error.message ,success:false});
    }
};


export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { title, desc, img, categories, size, color, price, inStock } = req.body;
    try {
        const product = await Product.findById(id);

        if (product) {
            product.title = title;
            product.desc = desc;
            product.img = img;
            product.categories = categories;
            product.size = size;
            product.color = color;
            product.price = price;
            product.inStock = inStock;

            const updatedProduct = await product.save();
            if(updatedProduct){
                return res.status(200).send({message:"Product added Successfully"});
            }
        } else {
            return res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Server Error' });
    }
};


export const getProduct = async (req, res) => {
    try {
        const { id } = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format", success: false });
        }

        const product = await Product.findOne({"variants._id":new ObjectId(id)})

        if (!product) {
            return res.status(404).json({ message: "Product not found", success: false });
        }

        const variant = product.variants.find(v => v._id.toString() === id);

        if (!variant) {
            return res.status(404).json({ message: "Variant not found", success: false });
        }

        const data = {
            variantId:variant._id,
            _id:product._id,//parent id 
            title: product.title,
            desc: product.desc,
            categories: product.categories,
            price: variant.price,
            inStock: variant.inStock,
            color: variant.color,
            size: variant.size,
            img: variant.img
        };

        return res.status(200).json({ variant: data, success: true });

    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};


export const deleteProduct = async (req, res) => {
    const { id } = req.body;

    try {
        const product = await Product.findOneAndUpdate(
            { "variants._id": id }, // Match the document where variants array contains an element with _id equal to id
            { $pull: { variants: { _id: id } } }, // Pull (remove) the element from variants array where _id matches id
            { new: true } // Optional: Return the updated document after update
          );
          
        if (product) {
            return res.status(200).send({ message: 'Product removed',success:true});
        } else {
            return res.status(500).send({ message: 'Product not Removed',success:false,"id":id});
        }
    } catch (error) {
        return res.status(500).send({ message: error.message,success:false});
    }

};

