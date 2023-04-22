import { useUzivatel } from '@/context/uzivatel';
import herobg from '@/public/hero-background.webp';
import heroguy from '@/public/hero-guy.webp';
import opat from '@/public/opat.webp';
import style from '@/styles/Index.module.css';
import { loadStripe } from '@stripe/stripe-js';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { GiLaurelCrown } from 'react-icons/gi';
import { SiLinktree } from 'react-icons/si';
import { TiTick } from 'react-icons/ti';
import initStripe from 'stripe';

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
		<>
			<Head>
				<title>Chceš se zlepšit v LOLku? Opat04 tě to naučí</title>
			</Head>
			<header className={style.header}>
				<div className={style.headermenu}>
					<div className={style.logo_area}>
						<span>Opat04</span>
					</div>
					<nav className={style.menu}>
						<ul>
							<li>
								<Link scroll={false} href={'#'}>
									Domů
								</Link>
							</li>
							<li>
								<Link scroll={false} href={'#info'}>
									O kurzu
								</Link>
							</li>
							<li>
								<Link scroll={false} href={'#co-te-naucim'}>
									Co tě naučím
								</Link>
							</li>
							<li>
								<Link scroll={false} href={'#pripojit-se'}>
									Cena
								</Link>
							</li>
						</ul>
					</nav>
				</div>
				{nacita ? "" : uzivatel ? (
					<div className={style.cta_area}>
						<Link href={'/feed'}>Otevřít kurz</Link>
					</div>
				) : (
					<div className={style.cta_area}>
						<Link href={'/auth/prihlasit'}>Přihlásit se</Link>
						<Link scroll={false} href={'#pripojit-se'}>
							Připojit se
						</Link>
					</div>
				)}
			</header>
			<main>
				<section className={style.hero_section}>
					<div className={style.hero_area}>
						<div className={style.hero_text}>
							<span>League of Legends video kurz</span>
							<h1>Lorem ipsum dolor sit amet, adipiscing elit.</h1>
							<p>
								Donec iaculis gravida nulla. Phasellus rhoncus. Neque porro
								quisquam est.
							</p>
							<Link scroll={false} href={'#co-te-naucim'}>
								Co tě naučím?
							</Link>
						</div>
						<div className={style.hero_guy}>
							<Image src={heroguy} alt="" />
						</div>
					</div>
					<div className={style.herobg_area}>
						<div className={style.hero_bg_clona}></div>
						<Image className={style.hero_bg} src={herobg} alt=""></Image>
					</div>
				</section>
				<section id="info" className={style.info_sekce}>
					<div className={style.info_maintext}>
						<h2>Lorem ipsum dolor sit amet, adipiscing elit.</h2>
						<p>
							Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Duis
							bibendum, lectus ut viverra rhoncus, dolor nunc faucibus libero.
						</p>
						<p>
							Eget facilisis enim ipsum id lacus. Nullam faucibus mi quis velit.
							Maecenas lorem. Aliquam erat volutpat. Etiam commodo dui eget
							wisi. Suspendisse sagittis ultrices augue.
						</p>
						<p>
							In convallis. Nullam justo enim, consectetuer nec, ullamcorper ac,
							vestibulum in, elit.
						</p>
					</div>
					<div>
						<iframe
							className={style.info_video}
							src="https://www.youtube.com/embed/L3nxnY1vkaE"
							title="YouTube video player"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							allowfullscreen
						></iframe>
					</div>
					<div className={style.info_links}>
						<Link scroll={false} href={'#pripojit-se'}>
							Připojit se
						</Link>
						<Link scroll={false} href={'#co-te-naucim'}>
							Více informací
						</Link>
					</div>
				</section>
				<section id="co-te-naucim" className={style.naucim}>
					<h2>Co tě naučím?</h2>
					<div className={style.naucim_area}>
						<div className={style.naucim_image}>
							<Image src={opat} alt="" />
						</div>
						<div className={style.naucim_cards}>
							<Image src={herobg} alt="" />
							<div className={style.naucim_card}>
								<GiLaurelCrown size={60} />
								<h3>Staň se lepším hráčem</h3>
								<p>
									Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Duis
									bibendum.
								</p>
							</div>
							<div className={style.naucim_card}>
								<GiLaurelCrown size={60} />
								<h3>Staň se lepším hráčem</h3>
								<p>
									Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Duis
									bibendum.
								</p>
							</div>
							<div className={style.naucim_card}>
								<GiLaurelCrown size={60} />
								<h3>Staň se lepším hráčem</h3>
								<p>
									Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Duis
									bibendum.
								</p>
							</div>
						</div>
					</div>
					<Link scroll={false} className={style.join} href={'#pripojit-se'}>
						Připojit se
					</Link>
				</section>

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
			</main>
			<footer className={style.footer}>
				<div className={style.footer_list}>
					<a href="https://linktr.ee/opat04" target="_blank">
						<SiLinktree size={30} />
					</a>
					<h4>OPAT04</h4>
					<Link href={''}>Obchodní podmínky</Link>
				</div>
				<a
					className={style.actionflow}
					href="https://actionflow.cz/"
					target="_blank"
				>
					ActionFlow<span>&copy;2023</span>
				</a>
			</footer>
		</>
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
