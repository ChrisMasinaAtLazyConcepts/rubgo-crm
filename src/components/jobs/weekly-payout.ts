// backend/jobs/weeklyPayouts.js
const cron = require('node-cron');
const Payment = require('../models/Payment');
const MassageRequest = require('../models/MassageRequest');
const Therapist = require('../models/Therapist');

// Run every Monday at 9 AM
cron.schedule('0 9 * * 1', async () => {
  console.log('Starting weekly payout process with RubGo service fee...');
  
  try {
    // Find all completed massage requests from last week that haven't been paid out
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const completedRequests = await MassageRequest.find({
      status: 'completed',
      paymentStatus: 'paid',
      createdAt: { $gte: oneWeekAgo },
      payoutProcessed: { $ne: true } // New field to track if payout processed
    });

    console.log(`Found ${completedRequests.length} requests to process for payout`);

    for (const request of completedRequests) {
      // Create payment record with RubGo service fee
      const payment = new Payment({
        therapistId: request.therapistId,
        requestId: request._id,
        basePrice: request.basePrice,
        travelFee: request.travelFee,
        rubgoServiceFee: request.rubgoServiceFee,
        therapistEarnings: request.therapistEarnings,
        totalAmount: request.totalPrice,
        status: 'pending',
        paymentDate: new Date(),
        payoutDate: new Date() // Payout immediately in weekly job
      });

      await payment.save();
      
      // Mark request as payout processed
      request.payoutProcessed = true;
      await request.save();
      
      console.log(`Created payment record ${payment._id} for therapist ${request.therapistId}`);
    }

    // Process all pending payments
    const pendingPayments = await Payment.find({
      status: 'pending'
    }).populate('therapistId');

    let totalServiceFees = 0;
    let totalTherapistPayouts = 0;

    for (const payment of pendingPayments) {
      // Process payment to therapist's account (minus RubGo service fee)
      const therapistPayout = payment.therapistEarnings;
      
      // Here you would integrate with your payment processor
      // For now, we'll simulate the payment
      await processTherapistPayout(payment.therapistId, therapistPayout);
      
      // Accumulate RubGo service fees to master account
      totalServiceFees += payment.rubgoServiceFee;
      totalTherapistPayouts += therapistPayout;
      
      payment.status = 'completed';
      payment.processedDate = new Date();
      await payment.save();
      
      console.log(`Processed payout of R${therapistPayout} to therapist ${payment.therapistId._id}`);
    }

    // Transfer service fees to RubGo master account
    if (totalServiceFees > 0) {
      await transferToMasterAccount(totalServiceFees);
      console.log(`Transferred R${totalServiceFees} service fees to RubGo master account`);
    }

    console.log(`Weekly payout process completed:
      - Total Service Fees: R${totalServiceFees}
      - Total Therapist Payouts: R${totalTherapistPayouts}
      - Total Processed: ${pendingPayments.length} payments
    `);

  } catch (error) {
    console.error('Error in weekly payout process:', error);
  }
});

async function processTherapistPayout(therapistId, amount) {
  // Integration with payment gateway (Stripe, PayPal, bank transfer, etc.)
  // This would actually transfer money to therapist's account
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Transferred R${amount} to therapist ${therapistId}`);
      resolve();
    }, 100);
  });
}

async function transferToMasterAccount(amount) {
  // Transfer RubGo service fees to master account
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Transferred R${amount} service fees to RubGo master account`);
      resolve();
    }, 100);
  });
}

module.exports = { processWeeklyPayouts };