import { getServiceSupabase, supabase } from '@/utils/supabase';
import { JWT } from '@mux/mux-node';
import MuxPlayer from '@mux/mux-player-react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Lekce({ slug, accessToken }) {
	const router = useRouter();
	const [lekce, setLekce] = useState(null);

	console.log(accessToken);

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
						<MuxPlayer streamType="on-demand" src={`https://stream.mux.com/${lekce.playback_id}.m3u8?token=${accessToken}`} />
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

	const { data: lekce } = await getServiceSupabase
		.from('lekce')
		.select('playback_id')
		.eq('slug', params.slug)
		.single();

	if (lekce.playback_id) {
		const playbackId = playback_id;

		let baseOptions = {
			keyId: process.env.MUX_SECRET_KEY_ID,
			keySecret: process.env.MUX_SECRET_BASE,
			expiration: '7d',
		};

		const token = JWT.sign(playbackId, { ...baseOptions, type: 'video' });
	}

	return {
		props: { slug: slug, accessToken: token },
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
