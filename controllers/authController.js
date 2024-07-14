import bcrypt from 'bcryptjs'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js';


export const signup = async (req,res)=>{
    try {
        const {name,email,password,confirmpassword} = req.body
        
        if(password !==confirmpassword){
            return res.status(400).json({error:"Password dont't match"});
        }
        const Email = await User.findOne({email});
        if(Email){
            return res.status(400).json({error:"User already exists"});
        }

        // Hashing Password //

        const salt = await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const newUser = new User({
            name,
            email,
            password:hashedPassword
        })

        if(newUser){
            generateToken(newUser._id,res);
            await newUser.save();

            res.status(201).json({
                _id:newUser._id,
                name:newUser.name,
                email:newUser.email,
            });
        }else{
            res.status(400).json({error:"Invalid user data"});
        }
    
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }

}

export const login = async (req,res)=>{
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email});
        const isPasswordCorrect = await bcrypt.compare(password,user?.password || "");
        if(!user || !isPasswordCorrect){
            return res.status(400).json({error:"Invalid username or password"});
        }
        generateToken(user._id,res);

        res.status(201).json({
            _id:user._id,
            email:user.email,

        })
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const logout = (req, res) => {
    try {
        res.cookie('jwt',"",{maxAge:0})
        res.status(200).json({message:"Logged out successfully"});

    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
    
}