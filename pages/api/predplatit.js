import initStripe from 'stripe';

const handler = async (req, res) => {
	if (req.method === 'POST') {
		const { planId, zakaznik } = req.body;

		if(!planId) {
         return res.status(400).json({ error: "Nebylo posláno příslušné předplatné" });
      }
		if(!zakaznik) {
         return res.status(401).json({ error: "Nebyl poslán příslušný uživatel" });
      }

		const stripe = initStripe(process.env.STRIPE_SECRET_KEY);

		const lineItems = [
			{
				price: planId,
				quantity: 1,
			},
		];

		const session = await stripe.checkout.sessions.create({
			customer: zakaznik,
			mode: 'subscription',
			payment_method_types: ['card'],
			line_items: lineItems,
			success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/predplatne/zaplaceno`,
			cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/predplatne/zruseno`,
		});

		return res.status(200).json({ sessionid: session.id });
	} else {
		return res.status(405).json({
			error: 'Tato metoda požadavku není povolena',
		});
	}
};

export default handler;
