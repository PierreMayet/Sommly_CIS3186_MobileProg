const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const stripe = Stripe("sk_test_51SmbsSI0awnRhdBdcmSuEOLDcpqg7xC4KUp5MyunhBINKKSa4CnVXoHCzzYBgiDpTG4Jc1uNSABm6ZFVJh6uqFRv00z4lQKE7n"); //  Replace this with your real secret key!

app.post("/create-payment-intent", async (req, res) => {
  const { amount } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount || 1000, // Use provided amount or default to 1000
    currency: "usd",
  });

  res.send({ clientSecret: paymentIntent.client_secret });
});

app.listen(4242, "0.0.0.0", () => {
  console.log("Backend running on http://localhost:4242");
});