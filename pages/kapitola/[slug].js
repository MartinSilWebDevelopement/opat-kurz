import Loading from '@/components/loading';
import Navigation from '@/components/navigation';
import { useUzivatel } from '@/context/uzivatel';
import style from '@/styles/Kapitola.module.css';
import progressstyle from '@/styles/Progress.module.css';
import { supabase } from '@/utils/supabase';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { TiTick } from 'react-icons/ti';

export default function Lekce({ slug }) {
	const router = useRouter();
	const [kapitola, setKapitola] = useState(null);
	const [nacita, setNacita] = useState(true);
	const [isLoading, setIsLoading] = useState(true);

	const { uzivatel, nacita: nacitaProfil } = useUzivatel();

	const [pocetZhlednutiVKapitole, setPocetZhlednutiVKapitole] = useState();
	const [pocetLekciVKapitole, setPocetLekciVKapitole] = useState();

	useEffect(() => {
		const fetchPage = async () => {
			const user = await supabase.auth.getUser();
			if (user.data.user) {
				const { data: profil } = await supabase
					.from('profil')
					.select('odebira')
					.eq('id', user.data.user.id)
					.single();
				if (profil.odebira) {
					const { data: kapitola } = await supabase
						.from('kapitola')
						.select(`*, lekce("*")`)
						.eq('slug', slug)
						.single();
					if (kapitola) {
						setKapitola(kapitola);
						setNacita(false);
						setPocetLekciVKapitole(kapitola.lekce.length);
						const { data: pokrok } = await supabase
							.from('pokrok')
							.select('lekce')
							.eq('profil', user.data.user.id);
						if (pokrok) {
							const matchingLekce = kapitola.lekce.filter((l) => {
								return pokrok.some((p) => p.lekce === l.id);
							});
							setPocetZhlednutiVKapitole(matchingLekce.length);
						}
						setIsLoading(false);
					} else {
						router.push('/kapitola/neexistuje');
					}
				} else {
					router.push('/feed');
				}
			} else {
				router.push('/auth/prihlasit');
			}
		};
		fetchPage();
	}, []);

	return (
		<>
			<Head>
				{kapitola ? (
					<title>
						{'Kapitola ' + kapitola?.poradi + ' - ' + kapitola?.nazev}
					</title>
				) : (
					<title>Načítání kapitoly</title>
				)}
			</Head>
			{!isLoading ? (
				<section className={style.sekce}>
					<Navigation />
				
					<div className={progressstyle.sekce}>
						{isLoading ? (
							<Loading />
						) : (
							<div className={progressstyle.progress}>
								<div className={progressstyle.number}>
									<h2>
										<span>{pocetZhlednutiVKapitole}</span> /{' '}
										{pocetLekciVKapitole}
									</h2>
								</div>
								<div className={progressstyle.progress_bar}>
									<div
										style={{
											width:
												(100 / pocetLekciVKapitole) * pocetZhlednutiVKapitole +
												'%',
										}}
										className={progressstyle.progress_width}
									></div>
								</div>
							</div>
							
						)}
					</div>
					<div className={style.kapitola_info}>
						<h1>{kapitola?.nazev}</h1>
						<span>{'Kapitola ' + kapitola?.poradi}</span>
					</div>
					<div className={style.lekce_kapitoly}>
						{kapitola?.lekce.map((l) => (
							<Link
								className={style.lekce}
								href={'/lekce/' + l.slug}
								key={l.id}
							>
								<div className={style.lekce_text}>
									
									{l.banner_url ? (
										<Image
											className={style.lekce_banner}
											height={90}
											width={160}
											src={l.banner_url}
											alt={l.nazev}
										/>
									) : (
										<div className={style.lekce_banner}>?</div>
									)}
									<span>{kapitola?.poradi + '.' + l.poradi_v_kapitole}</span>
									<h1>{l.nazev}</h1>
								</div>
								{!nacitaProfil &&
									uzivatel.pokrok.some((p) => p.lekce === l.id) && (
										<TiTick className={style.zobrazeno} size={60} />
									)}
							</Link>
						))}
					</div>
				</section>
			) : (
				<div style={{ height: '100vh' }}>
					<Loading />
				</div>
			)}
		</>
	);
}

export async function getServerSideProps({ params }) {
	const slug = params.slug;
	return {
		props: { slug: slug },
	};
}
