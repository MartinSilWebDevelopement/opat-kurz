import { supabase } from '@/utils/supabase.js';
import Link from 'next/link';
import { useUzivatel } from '@/context/uzivatel';
import { useState, useEffect } from 'react';

export default function Home() {
	const [lekce, setLekce] = useState([])
	useEffect(() => {
		const fetchLekce = async () => {
			const { data: lekce, error } = await supabase.from('lekce').select('*');
			if(!error) {
				setLekce(lekce);
			}
		}
		fetchLekce();
	})
	return (
		<section>
			{lekce.map((l) => (
				<Link key={l.id} href={"/lekce/" + l.slug}>
					<div>
						<h1>{l.nazev}</h1>
					</div>
				</Link>
			))}
		</section>
	);
}