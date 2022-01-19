const router = require("express").Router();
const UserSchema = require("../models/User")
const Razorpay = require("razorpay")
const shortId = require("shortid")

let razorpayInstance = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET,
  });


router.get("/",(req,res) =>{
    res.send("hello")
})

router.post("/registerUser",async (req,res)=>{
    const {addedMembers,selectedPlanId,email} = req.body
    let isAlreadyExists = await UserSchema.findOne({email},{email:1});
    console.log(isAlreadyExists)
    if(isAlreadyExists) return res.send({success:false,message:"email alredy registered please enter new email"})
    let newUser = new UserSchema(req.body);
    newUser.encryptPass(req.body.password)
    newUser.calculateAmount(addedMembers,selectedPlanId)
    newUser.save((err,result)=>{
        if (err){
            console.log(err)
            res.send(err);
        }
        else{
            const {amount,selectedPlanTitle} = result
            res.send({success:true,amount,selectedPlanTitle})
        }
    })
})

router.post("/getUser",(req,res)=>{
    res.send("hello")
})

router.post("/loginUser",async(req,res)=>{
    const {email,password} = req.body;
    console.log(password)
    const user = await UserSchema.findOne({email});
    if(user) {
        const inUser = new UserSchema(user);
        if(inUser.checkPass(password)){
            res.send({success:true})
        }else{
            res.send({sucess:false})
        }
     }
    else  res.send({sucess:false})

})


router.post('/createOrder', async(req, res)=>{ 
  
    // STEP 1:
    const {email}  = req.body; 
    const data =await UserSchema.findOne({email})   
    let inUser = new UserSchema(data)  
    const payment_capture = 1
    const currency = "INR"
    console.log(inUser)
    // STEP 2:   
    let options = {
        amount : (inUser.amount * 100).toString(),
        currency,
        receipt: shortId.generate(),
        payment_capture} 
    let resp = await razorpayInstance.orders.create(options)
    res.send(resp)
});

module.exports = router;