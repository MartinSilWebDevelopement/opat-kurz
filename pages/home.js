import { useUzivatel } from '@/context/uzivatel';
import { supabase } from '@/utils/supabase.js';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BiLinkAlt } from 'react-icons/bi';

export default function Home() {
	const [kapitoly, setKapitoly] = useState([]);

	useEffect(() => {
		const fetchLekce = async () => {
			const { data: kapitola, error } = await supabase
				.from('kapitola')
				.select(`*, lekce("*")`);
			if (!error) {
				console.log(kapitola);
				setKapitoly(kapitola);
			}
		};
		fetchLekce();
	});

	return (
		<section>
			{kapitoly.map((kapitola) => (
				<div key={kapitola.id}>
					<div>
						<Link href={'/kapitola/' + kapitola.slug}>
							<BiLinkAlt />
						</Link>
						<span>{kapitola.poradi}</span>
						<h1>{kapitola.nazev}</h1>
					</div>
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						{kapitola.lekce.map((l) => (
							<Link key={l.id} href={'/lekce/' + l.slug}>
								{l.nazev}
							</Link>
						))}
					</div>
				</div>
			))}
		</section>
	);
}
