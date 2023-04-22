import Loading from '@/components/loading';
import Navigation from '@/components/navigation';
import { useUzivatel } from '@/context/uzivatel';
import styles from '@/styles/Profil.module.css';
import { supabase } from '@/utils/supabase';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Profil() {
	const router = useRouter();
	const { uzivatel, nacita } = useUzivatel();

	useEffect(() => {
		const fetchUzivatele = async () => {
			const user = await supabase.auth.getUser();
			if (!user.data.user) {
				router.push('/auth/prihlasit');
			}
		};
		fetchUzivatele();
	}, []);

	const loadPortal = async () => {
		const body = {
			uzivatel: uzivatel.stripe_customer_id,
		};
		const res = await fetch('/api/nacist-stripe-portal', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		});
		const data = await res.json();
		router.push(data.url);
	};

	return (
		<section>
			<Head>
				<title>Uživatelský profil</title>
			</Head>
			{nacita ? (
				<div style={{ height: '100vh' }}>
					<Loading />
				</div>
			) : (
				<section className={styles.sekce}>
					<Navigation />
					<div className={styles.profil_karta}>
						<h1>Uživatelský profil</h1>
						<div className={styles.karta_info}>
							<p>
								Aktivní předplatné:{' '}
								{uzivatel?.odebira ? (
									<span className={styles.ano}>Ano</span>
								) : (
									<span className={styles.ne}>Ne</span>
								)}
							</p>
							<span>{uzivatel?.jmeno}</span>
							<span>{uzivatel?.email}</span>
							<button onClick={loadPortal}>Spravovat předplatné</button>
						</div>
					</div>
				</section>
			)}
		</section>
	);
}
