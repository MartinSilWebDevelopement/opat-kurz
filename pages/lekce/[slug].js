import { getServiceSupabase, supabase } from '@/utils/supabase';
import Mux from '@mux/mux-node';
import MuxVideo from '@mux/mux-video-react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Lekce({ slug, accessToken, playback }) {
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
						<MuxVideo
							controls
							metadata={{
								video_id: lekce.slug,
								video_title: lekce.nazev,
							}}
							playbackId={`${playback}?token=${accessToken}`}
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

		const token = Mux.JWT.signPlaybackId(playbackId, {
			keyId: process.env.MUX_SECRET_KEY_ID,
			keySecret: process.env.MUX_SECRET_BASE,
		});

		return {
			props: { slug: slug, accessToken: token, playback: lekce.playback_id },
		};
	}

	return {
		props: { slug: slug },
	};
}
