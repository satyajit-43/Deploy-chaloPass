const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  source: String,
  destination: String,
  fare: Number,
  status: { type: String, default: 'booked' },
  // other ticket fields
}, { timestamps: true });

module.exports = mongoose.model('Ticket', TicketSchema);