import { supabase } from '@/utils/supabase';
import MuxPlayer from '@mux/mux-player-react';
import Head from 'next/head';

export default function Lekce({ lekce }) {
	return (
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
	);
}

export async function getServerSideProps({ params }) {
	const { data: lekce } = await supabase
		.from('lekce')
		.select(`*`)
		.eq('slug', params.slug)
		.single();

	if (!lekce || lekce.length === 0) {
		return {
			redirect: {
				destination: '/lekce/neexistuje',
				permanent: false,
			},
		};
	}

	return {
		props: { lekce },
	};
}
