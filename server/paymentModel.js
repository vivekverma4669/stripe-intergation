const mongoose = require('mongoose');
const paySchema = mongoose.Schema({
    item : { type: String, required: true },
    status: { type: Boolean, required: true },
    transId : { type: String },
});
const paymentSchema = mongoose.model('pay', paySchema);
module.exports = {paymentSchema};
