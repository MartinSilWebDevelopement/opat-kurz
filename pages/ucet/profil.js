import { useUzivatel } from '@/context/uzivatel';
import { supabase } from '@/utils/supabase';
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
	}, [router]);

	const loadPortal = async () => {
		const body = {
			uzivatel: uzivatel.stripe_customer_id
		}
		const res = await fetch('/api/nacist-stripe-portal', {
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(body)
		});
		const data = await res.json();
		router.push(data.url);
	}

	return (
		<section>
			{nacita ? (
				<div>
					<h1>Načítání...</h1>
				</div>
			) : (
				<div style={{ display: "flex", flexDirection: "column", gap: "20px"}}>
					<h1>Uživatelský profil</h1>
					<p>Aktivní předplatné <b>{uzivatel.odebira ? "Ano" : "Ne"}</b></p>
					<span>{uzivatel?.jmeno}</span>
					<span>{uzivatel?.email}</span>
					<button onClick={loadPortal}>Spravovat předplatné</button>
				</div>
			)}
		</section>
	);
}
