const mongoose = require("mongoose");

 const loanSchema  = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userDetails",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    term: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected","Paid" ],
      default: "Pending",
    },
  },
  { timestamps: true }
  
 );

 const loanModel = mongoose.model('loanDetails', loanSchema);

 module.exports = loanModel