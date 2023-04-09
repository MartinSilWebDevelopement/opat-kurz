import { supabase } from '@/utils/supabase';
import initStripe from 'stripe';

const handler = async (req, res) => {
  if(req.query.API_ROUTE_SECRET !== process.env.API_ROUTE_SECRET) {
    return res.status(401).send('Nejste oprávněni volat toto API')
  }

	const stripe = initStripe(process.env.STRIPE_SECRET_KEY);

	const customer = await stripe.customers.create({
		email: req.body.record.email,
	});

	await supabase
		.from('profil')
		.update({ stripe_customer_id: customer.id })
		.eq('id', req.body.record.id);

	res.send({ message: `Stripe customer created ${customer.id}` });
};

export default handler;
