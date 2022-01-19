const mongoose = require("mongoose");
const crypto = require("crypto")
const {Schema} = mongoose;
const plansList = require("../plans.json")
const UserSchema = new Schema({
     email: {type: String, require: true, unique: true},
     hash: String,
     salt: String,
     addedMembers:[{
          name: {type:String},
          age: {type: Number},
          relation: {type: String}
     }],
     selectedPlanTitle: {type: String, require: true},
     selectedPlanId: {type: Number, require: true},
     phoneNumber: {type: String, require: true},
     amount:{type: Number},
     isAmountPaid:{type: Boolean, default:false},
     timestamp: { type: Date, default: Date.now },
})

UserSchema.methods.calculateAmount = function(addedMembers,selectedPlanId){
    let totalPrice = 0;
    addedMembers.map(obj =>{
        let ageType = plansList.costChart.find(each => ((each.lower <= Number(obj.age)) && (Number(obj.age) <= each.upper)))
        totalPrice +=  Number(ageType.cost)
    })
    let planCost = plansList.plans.find(obj => obj.id == selectedPlanId)
    let cost = Number(planCost.visits) * 500
    totalPrice += Number(cost)
    this.amount = totalPrice
}

UserSchema.methods.encryptPass = function(password) {
     this.salt = crypto.randomBytes(16).toString("hex");
     this.hash = crypto
         .pbkdf2Sync(password, this.salt, 100000, 64, "sha512")
         .toString("hex");
 };

 UserSchema.methods.checkPass = function(password) {
     let hash = crypto
         .pbkdf2Sync(password, this.salt, 100000, 64, "sha512")
         .toString("hex");
     return hash === this.hash;
 };

 module.exports = mongoose.model("User", UserSchema);