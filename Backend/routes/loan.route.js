const express = require("express");
const router = express.Router();

const authentication = require("../auth");

// const loanController = require("../controllers/loan.controller");
const {
  createLoan,
  getAllLoans,
  getLoanById,
  getPaymentsById,
  doPayment,
  updateStatus,
} = require("../controllers/loan.controller");

router.post('/createLoan', authentication, createLoan);
router.get('/allloans', authentication, getAllLoans);
router.get('/loans/:id', authentication, getLoanById);
router.get('/payments/:id', authentication, getPaymentsById);
router.post('/doPayment', authentication, doPayment);
router.put('/update', authentication, updateStatus);

module.exports = router;
