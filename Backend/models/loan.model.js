const mongoose = require("mongoose");

 const loanSchema  = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userDetails",
      required: true,
    },
    loanAmount: {
      type: Number,
      required: true,
    },
    loanTerm: {
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