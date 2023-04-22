import Loading from '@/components/loading';
import Navigation from '@/components/navigation';
import Progress from '@/components/progress';
import { useUzivatel } from '@/context/uzivatel';
import style from '@/styles/Feed.module.css';
import { supabase } from '@/utils/supabase.js';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { BiLinkAlt } from 'react-icons/bi';
import { TiTick } from 'react-icons/ti';

export default function Feed() {
	const [kapitoly, setKapitoly] = useState([]);
	const router = useRouter();
	const { nacita, uzivatel } = useUzivatel();
	const [isLoading, setIsLoading] = useState(true);

	const [dropdownStates, setDropdownStates] = useState({});

	const toggleDropdown = (chapterId) => {
		setDropdownStates((prevState) => ({
			...prevState,
			[chapterId]: !prevState[chapterId],
		}));
	};

	useEffect(() => {
		const fetchPage = async () => {
			const user = await supabase.auth.getUser();
			if (user.data.user) {
				const { data: kapitola } = await supabase
					.from('kapitola')
					.select(`*, lekce("*")`);
				if (kapitola) {
					setKapitoly(kapitola);
				}
				setIsLoading(false);
			} else {
				router.push('/auth/prihlasit');
			}
		};
		fetchPage();
	}, []);

	return (
		<section className={style.sekce}>
			<Head>
				<title>Opat04</title>
			</Head>
			<Navigation />
			{isLoading ? (
				<div style={{ height: '60vh' }}>
					<Loading />
				</div>
			) : (
				<>
					{!isLoading && !nacita ? (
						uzivatel.odebira ? (
							<>
								<Progress />
								<section className={style.kapitoly}>
									{isLoading ? (
										<div style={{ position: 'relative', top: '20vh' }}>
											<Loading />
										</div>
									) : (
										kapitoly.map((kapitola) => (
											<div className={style.kapitola} key={kapitola.id}>
												<div
													className={style.kapitola_nadpis}
													style={{
														borderRadius: dropdownStates[kapitola.id]
															? 'var(--border-radius) var(--border-radius) 0 0'
															: 'var(--border-radius)',
													}}
												>
													<Link href={'/kapitola/' + kapitola.slug}>
														<BiLinkAlt size={30} />
													</Link>
													<div
														onClick={() => toggleDropdown(kapitola.id)}
														className={style.kapitola_nazev}
													>
														<span>{kapitola.poradi}</span>
														<h1>{kapitola.nazev}</h1>
													</div>
												</div>
												<div
													className={style.lekce_area}
													style={{ display: 'flex', flexDirection: 'column' }}
												>
													{dropdownStates[kapitola.id] &&
														kapitola.lekce
															.sort(
																(a, b) =>
																	a.poradi_v_kapitole - b.poradi_v_kapitole
															)
															.map((l) => (
																<Link
																	className={style.lekce_card}
																	key={l.id}
																	href={'/lekce/' + l.slug}
																>
																	<div className={style.lekce_card_text}>
																		<div className={style.lekce_oznaceni}>
																			<span>
																				{kapitola.poradi}.{l.poradi_v_kapitole}
																			</span>
																		</div>
																		<div className={style.lekce_obrazek_area}>
																			{l.banner_url ? (
																				<Image
																					className={style.lekce_obrazek}
																					src={l.banner_url}
																					width={96}
																					height={54}
																					alt={l.nazev}
																				/>
																			) : (
																				<div className={style.lekce_obrazek}>
																					?
																				</div>
																			)}
																		</div>
																		<span>{l.nazev}</span>
																	</div>
																	{uzivatel.pokrok.some(
																		(p) => p.lekce === l.id
																	) && (
																		<TiTick
																			className={style.zobrazeno}
																			size={30}
																		/>
																	)}
																</Link>
															))}
												</div>
											</div>
										))
									)}
								</section>
							</>
						) : (
							<section className={style.nonpaid}>
								<div className={style.nonpaid_box}>
									<h1>Nemáš zaplacené předplatné</h1>
									<Link href={'/predplatit'}>Připojit se</Link>
								</div>
							</section>
						)
					) : (
						<></>
					)}
				</>
			)}
		</section>
	);
}
