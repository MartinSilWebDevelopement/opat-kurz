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
						<MuxPlayer
							streamType="on-demand"
							src={`https://stream.mux.com/${lekce.playback_id}.m3u8?token=${accessToken}`}
						/>
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

	const supabase = getServiceSupabase();

	const { data: lekce } = await supabase
		.from('lekce')
		.select('playback_id')
		.eq('slug', params.slug)
		.single();

	if (lekce.playback_id) {
		const playbackId = lekce.playback_id;

		let baseOptions = {
			keyId: process.env.MUX_SECRET_KEY_ID,
			keySecret: process.env.MUX_SECRET_BASE,
			expiration: '1d',
		};

		const token = JWT.sign(playbackId, { ...baseOptions, type: 'video' });

		return {
			props: { slug: slug, accessToken: token },
		};
	}

	return {
		props: { slug: slug },
	};
}
