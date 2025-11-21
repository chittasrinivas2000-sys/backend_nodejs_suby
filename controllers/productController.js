const Product = require("../models/Product");
const Firm = require("../models/Firm");
const multer = require("multer");
const path = require("path");

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

const addProduct = async (req, res) => {
  try {
    const { productName, price, category, bestSeller, description } = req.body;

    const image = req.file ? req.file.filename : null;

    const firmId = req.params.firmId;

    const firm = await Firm.findById(firmId);
    if (!firm) {
      return res.status(404).json({ error: "Firm not found" });
    }

    const product = new Product({
      productName,
      price,
      category,
      bestSeller,
      description,
      image,
      firm: firm._id,
    });

    const savedProduct = await product.save();
    firm.products.push(savedProduct)

    // Ensure products array exists
    if (!firm.products) firm.products = [];

    firm.products.push(savedProduct._id);
    await firm.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error adding product: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getProductByFirm=async(req,res)=>{
    try{
        const firmId=req.params.firmId
        const firm=await Firm.findById(firmId);
        if(!firm){
            return res.status(404).json({error:"No firm found"})
        }
        const restaurantName=firm.firmName
        const products=await Product.find({firm:firmId})
        res.status(200).json({restaurantName,products})
    }catch(error){
        console.log(error)
        res.status(500).json({error:"internal server error"})
    }
}

const deleteProductById=async(req,res)=>{
    try{
        const productId=req.params.productId
        const deletedProduct=await Product.findByIdAndDelete(productId)
        if(!deletedProduct){
            return res.status(404).json({error:"No product found"})
        }
    }catch(error){
        console.log(error)
        res.status(500).json({error:"internal server error"})
    }
}

module.exports = {
  addProduct: [upload.single("image"), addProduct], getProductByFirm ,deleteProductById};
