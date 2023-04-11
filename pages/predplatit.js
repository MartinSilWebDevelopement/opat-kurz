import { useUzivatel } from '@/context/uzivatel';
import { loadStripe } from '@stripe/stripe-js';
import initStripe from 'stripe';
import Link from 'next/link';

export default function Predplatit({ plany }) {
	const { uzivatel, prihlasit, nacita } = useUzivatel();

	const zpracovatPredplaceni = async (planId) => {
		if (uzivatel && uzivatel.stripe_customer_id && !uzivatel.odebira) {
			const body = {
				planId: planId,
				zakaznik: uzivatel.stripe_customer_id,
			};
			const res = await fetch('/api/predplatit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			});
			const data = await res.json();
			const stripe = await loadStripe(
				process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
			);
			await stripe.redirectToCheckout({
				sessionId: data.sessionid,
			});
		}
	};

	const ukazatTlacitkoPredplaceni = !!uzivatel && !uzivatel.odebira;
	const ukazatTlacitkoPrihlaseni = !uzivatel;
	const ukazatTlacitkoSpravy = !!uzivatel && uzivatel.odebira;

	return (
		<div>
			{plany.map((plan) => (
				<div key={plan.id}>
					<h2>{plan.nazev}</h2>
					<p>
						{plan.cena / 100} {plan.mena == 'czk' && 'Kč'} /{' '}
						{plan.interval == 'month' ? 'měsíc' : 'rok'}
					</p>

					{!nacita && (
						<div>
							{ukazatTlacitkoPredplaceni && (
								<button onClick={() => zpracovatPredplaceni(plan.id)}>
									Získat ihned
								</button>
							)}
							{ukazatTlacitkoPrihlaseni && (
								<button onClick={prihlasit}>Přihlásit se</button>
							)}
							{ukazatTlacitkoSpravy && <Link href={"/uzivatel/profil"}>Spravovat předplatné</Link>}
						</div>
					)}
				</div>
			))}
		</div>
	);
}

export async function getServerSideProps() {
	const stripe = initStripe(process.env.STRIPE_SECRET_KEY);

	const { data: prices } = await stripe.prices.list();

	const plany = await Promise.all(
		prices.map(async (price) => {
			const product = await stripe.products.retrieve(price.product);
			return {
				id: price.id,
				nazev: product.name,
				cena: price.unit_amount,
				interval: price.recurring.interval,
				mena: price.currency,
			};
		})
	);

	const serazenePlany = plany.sort((a, b) => a.cena - b.cena);

	return {
		props: {
			plany: serazenePlany,
		},
	};
}
