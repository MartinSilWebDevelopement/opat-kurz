import { useUzivatel } from "@/context/uzivatel";
import { TiTick } from "react-icons/ti"
import Link from 'next/link';
import initStripe from 'stripe';
import style from '@/styles/Index.module.css';

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
		<section id="pripojit-se" className={style.cena}>
			<h2>Nepromeškej jedinečnou nabídku</h2>

			{plany.map((plan) => (
				<div className={style.cena_plan} key={plan.id}>
					<span className={style.cena_tag}>VIP Přístup</span>
					<div className={style.cena_cena}>
						<div className={style.cena_sleva}>
							<div className={style.cena_kriz}>
								<div></div>
								<div></div>
							</div>
							<span>{plan.cena / 100 + 200}</span>
						</div>
						<h3>{plan.cena / 100}</h3>
						<span>
							{plan.mena == 'czk' && 'Kč'}/
							{plan.interval == 'month' ? 'měsíc' : 'rok'}
						</span>
					</div>
					<p>
						Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Duis
						bibendum.
					</p>
					<hr />
					<div className={style.vyhody}>
						<div className={style.vyhoda}>
							<TiTick size={25} />
							<span>Výhoda</span>
						</div>
						<div className={style.vyhoda}>
							<TiTick size={25} />
							<span>Výhoda</span>
						</div>
						<div className={style.vyhoda}>
							<TiTick size={25} />
							<span>Výhoda</span>
						</div>
						<div className={style.vyhoda}>
							<TiTick size={25} />
							<span>Výhoda</span>
						</div>
					</div>
					{!nacita && (
						<div className={style.cena_cta}>
							{ukazatTlacitkoPredplaceni && (
								<button
									className={style.cena_cta_btn}
									onClick={() => zpracovatPredplaceni(plan.id)}
								>
									Získat ihned
								</button>
							)}
							{ukazatTlacitkoPrihlaseni && (
								<button
									className={style.cena_cta_btn}
									onClick={() => prihlasit('cena')}
								>
									Získat ihned
								</button>
							)}
							{ukazatTlacitkoSpravy && (
								<Link className={style.cena_cta_btn} href={'/ucet/profil'}>
									Spravovat předplatné
								</Link>
							)}
						</div>
					)}
				</div>
			))}
		</section>
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
