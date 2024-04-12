import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongodb";
import stripeInit from "stripe";

const stripe = stripeInit(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {

  if(req.method === 'POST') {

    const {user} = await getSession(req, res);

    const lineitems = [
      {
        price: process.env.STRIPE_PRODUCT_PRICE_ID,
        quantity: 1,
      }
    ];

    const protocol = process.env.NODE_ENV === 'development' ? "http://" : "https://";
    const host = req.headers.host;

    const checkoutsession = await stripe.checkout.sessions.create({
      line_items: lineitems,
      mode: "payment",
      success_url: `${protocol}${host}/success`,
      payment_intent_data: {
        metadata: {
          sub: user.sub,
        }
      },
      metadata: {
        sub: user.sub,
      }
    });

    res.status(200).json({ session: checkoutsession });
    return;
  }

  res.status(200).json({ name: 'no action was requested' });
}