const { onRequest } = require("firebase-functions/v2/https");
const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");

// REMPLACE PAR TA CLÉ STRIPE SECRÈTE (celle qui commence par sk_test...)
const stripe = Stripe("sk_test_4eC39HqLyjWDarjtT1zdp7dc"); 

const app = express();

// Autorise ton application mobile à appeler ce serveur
app.use(cors({ origin: true }));
app.use(express.json());

// La fonction qui crée le paiement
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount || 1000,
      currency: "eur",
      automatic_payment_methods: { enabled: true },
    });
    
    // On renvoie la clé secrète au téléphone
    res.status(200).send({ clientSecret: paymentIntent.client_secret });
  } catch (e) {
    console.error("Stripe Error:", e.message);
    res.status(400).send({ error: e.message });
  }
});

// On exporte cette API sous le nom "api"
exports.api = onRequest(app);