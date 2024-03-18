const paymentModel = require("../models/payment.model");

const userModel = require("../models/user.model")
const loanModel = require("../models/loan.model");


const paymentCalculation = (loan, payments) => {
  const { _id } = loan;
  const paymentSchedule = [];

  for (let i = 0; i < payments.length; i++) {
    const payment = new paymentModel({
      loanId: _id,
      amount: payments[i].amount,
      totalAmount: payments[i].amount,
      date: payments[i].date,
      status: "Pending",
    });
    paymentSchedule.push(payment);
  }

  return paymentSchedule;
};

exports.createLoan = async (req, res) => {
  try {
    // console.log(req.body);
    const { userId, amount, term, payments } = req.body;
    const user = req.user;
    // console.log(payments);

    if (user.isAdmin) {
      return res.status(401).json({
        success: false,
        message: "Only customer user can create loans!",
      });
    }

    const newLoan = await new loanModel({
      userId,
      amount,
      term,
    });

    // console.log(newLoan);
    newLoan.save();

    const paymentSchedule = paymentCalculation(newLoan, payments);


    console.log("paymentSchedule", paymentSchedule);
    let status = await paymentModel.insertMany(paymentSchedule);
 
    console.log("status", status);
    return res.status(200).json({
      success: true,
      message: "Loan Created Successfully...",
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.getAllLoans = async (req, res) => {
  try {
    const loans = await loanModel.find({}).populate({
      path: "userId",
      select: "name email isAdmin",
    });

    return res.status(200).json({
      success: true,
      message: "success...",
      loans,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getLoanById = async (req, res) => {
  try {
    const userId = req.params.id;

    const loans = await loanModel.find({ userId });

    return res.status(200).json({
      success: true,
      message: "Success...",
      loans,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPaymentsById = async (req, res) => {
  try {
    const loanId = req.params.id;

    const payments = await paymentModel.find({
      loanId,
    });
    return res.status(200).json({
      success: true,
      message: "Success...",
      payments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.doPayment = async (req, res) => {
  try {
    const { loanId, amount } = req.body;
    const loan = await loanModel.findById(loanId);

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: "Loan not found...",
      });
    }

    if (loan.status === "Paid") {
      return res.status(404).json({
        success: false,
        message: "Paid Already...",
      });
    }

    const pendingPayments = await paymentModel
      .find({
        loanId,
        status: "Pending",
      })
      .sort("dueDate");

    if (pendingPayments.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No Payments are pending...",
      });
    }

    let remainingAmount = amount;

    for (const payment of pendingPayments) {
      if (remainingAmount <= 0) break;

      const paidAmount = Math.min(payment.amount, remainingAmount);
      remainingAmount -= paidAmount;

      payment.amount -= paidAmount;
      if (payment.amount === 0) {
        payment.status = "Paid";
      }

      await payment.save();
    }

    const allPaymentsPaid = pendingPayments.every(
      (payment) => payment.status === "paid"
    );

    if (allPaymentsPaid) {
      loan.status = "Paid";
      await loan.save();
    }

    return res.status(200).json({
      success: true,
      message: "Payment Successful...",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { loanId, status } = req.body;

    const loan = await loanModel.findOne({ _id: loanId });

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: "Loan request not found...",
      });
    }

    if (loan.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Request has already been processed...",
      });
    }

    loan.status = status;
    console.log("status", status);

    await loan.save();
    console.log("loan", loan);
    return res.status(200).json({
      success: true,
      message: "Loan status updated successfully...",
    });

    console.log("Error in updating status by Admin...");
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// module.exports = [
//   createLoan,
//   getAllLoans,
//   getLoanById,
//   getPaymentsById,
//   doPayment,
//   updateStatus,
// ];
