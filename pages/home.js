import { supabase } from '@/utils/supabase.js';
import Link from 'next/link';

export default function Home({ lekce }) {
	console.log(lekce);
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

export async function getServerSideProps() {
	const { data: lekce } = await supabase.from('lekce').select('*');

	return {
		props: {
			lekce,
		},
	};
}
