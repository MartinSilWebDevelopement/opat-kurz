import { supabase } from '@/utils/supabase';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Lekce({ slug }) {
	const router = useRouter();
	const [kapitola, setKapitola] = useState(null);
	const [nacita, setNacita] = useState(true);

	useEffect(() => {
		const fetchLekceContent = async () => {
			const user = await supabase.auth.getUser();
			if (user.data.user) {
				const { data: kapitola, error } = await supabase
					.from('kapitola')
					.select(`*, lekce("*")`)
					.eq('slug', slug)
					.single();
				if (!error) {
					setKapitola(kapitola);
					setNacita(false);
				} else {
					router.push('/lekce/neexistuje');
				}
			} else {
				router.push('/auth/prihlasit');
			}
		};

		fetchLekceContent();
	}, []);

	return (
		<>
			{!nacita ? (
				<>
					<Head>
						<title>
							{'Kapitola ' + kapitola?.poradi + ' - ' + kapitola?.nazev}
						</title>
					</Head>
					<div>
						<span>{'Kapitola ' + kapitola?.poradi}</span>
						<h1>{kapitola?.nazev}</h1>
					</div>
					<div>
						{kapitola?.lekce.map((l) => (
							<Link href={'/lekce/' + l.slug} key={l.id}>
								<span>{kapitola?.poradi + '.' + l.poradi_v_kapitole}</span>
								<h1>{l.nazev}</h1>
							</Link>
						))}
					</div>
				</>
			) : (
				<p>Načítá se</p>
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
