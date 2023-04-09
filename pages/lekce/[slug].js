import { supabase } from '@/utils/supabase';
import MuxPlayer from '@mux/mux-player-react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Lekce({ slug }) {
	const router = useRouter();
	const [lekce, setLekce] = useState(null);

	useEffect(() => {
		const fetchLekceContent = async () => {
			const { data: lekce, error } = await supabase
				.from('lekce')
				.select(`*`)
				.eq('slug', slug)
				.single();
			if (!error) {
				setLekce(lekce);
			} else {
				router.push('/lekce/error');
			}
		};

		fetchLekceContent();
	}, []);

	return (
		<>
			{lekce ? (
				<>
					<Head>
						<title>{lekce.nazev}</title>
					</Head>
					<h1>{lekce.nazev}</h1>
					<div style={{ width: '40vw', height: 'auto' }}>
						<MuxPlayer streamType="on-demand" playbackId={lekce.playback_id} />
					</div>
					<div dangerouslySetInnerHTML={{ __html: lekce.obsah }} />
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
		props: { slug },
	};
}

// import { supabase } from '@/utils/supabase';
// import MuxPlayer from '@mux/mux-player-react';
// import Head from 'next/head';

// export default function Lekce({ lekce }) {
// 	return (
// 		<>
// 			<Head>
// 				<title>{lekce.nazev}</title>
// 			</Head>
// 			<h1>{lekce.nazev}</h1>
// 			<div style={{ width: '40vw', height: 'auto' }}>
// 				<MuxPlayer streamType="on-demand" playbackId={lekce.playback_id} />
// 			</div>
// 			<div dangerouslySetInnerHTML={{ __html: lekce.obsah }} />
// 		</>
// 	);
// }

// export async function getServerSideProps({ params }) {
// 	const { data: lekce } = await supabase
// 		.from('lekce')
// 		.select(`*`)
// 		.eq('slug', params.slug)
// 		.single();

// 	if (!lekce || lekce.length === 0) {
// 		return {
// 			redirect: {
// 				destination: '/lekce/neexistuje',
// 				permanent: false,
// 			},
// 		};
// 	}

// 	return {
// 		props: { lekce },
// 	};
// }
