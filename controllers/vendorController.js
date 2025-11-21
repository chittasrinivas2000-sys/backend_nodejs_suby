const Vendor = require('../models/Vendor');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotEnv = require("dotenv");
dotEnv.config();

const secretKey = process.env.whatIsYourName;

// REGISTER
const vendorRegister = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const vendorEmail = await Vendor.findOne({ email });
        if (vendorEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newVendor = new Vendor({
            username,
            email,
            password: hashedPassword
        });

        await newVendor.save();

        console.log("Registered");

        res.status(201).json({ message: "Vendor registered successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// LOGIN
const vendorLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const vendor = await Vendor.findOne({ email });

        if (!vendor) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, vendor.password);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign({ vendorId: vendor._id }, secretKey, { expiresIn: "1h" });

        console.log("Login successful:", email, token);

        res.status(200).json({
            message: "Login successful",
            token: token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}


const getAllVendors=async(req,res)=>{
    try{
        const vendors=await Vendor.find().populate("firms")
        res.json({vendors})
    }catch(error){
        console.log(error)
        res.status(500).json({error:"internal server error"})
    }
}

const getVendorById= async(req,res)=>{
    const vendor_id=req.params.id 
    try{
        const vendor=await Vendor.findById(vendor_id).populate('firms');
        if(!vendor){
            return res.status(404).json({error:"Vendor not Found"})
        }
        res.status(200).json({vendor})
    }catch(error){
        console.log(error)
        res.status(500).json({error:"Internal server error"})
    }
}



module.exports = { vendorRegister, vendorLogin ,getAllVendors,getVendorById};
