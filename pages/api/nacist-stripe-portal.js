import initStripe from 'stripe';

const handler = async (req, res) => {
	if (req.method === 'POST') {
		const { uzivatel } = req.body;

      if(!uzivatel) {
         return res.status(401).json({ error: "Nebyl poslán příslušný uživatel" });
      }

      const stripe = initStripe(process.env.STRIPE_SECRET_KEY);

      const session = await stripe.billingPortal.sessions.create({
         customer: uzivatel,
         return_url: `${process.env.NEXT_PUBLIC_DOMAIN}/uzivatel/profil`
      })

		return res.status(200).json({ url: session.url });
	} else {
		return res.status(405).json({
			error: 'Tato metoda požadavku není povolena',
		});
	}
};

export default handler;
