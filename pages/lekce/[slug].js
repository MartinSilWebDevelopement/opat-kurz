import { supabase } from '@/utils/supabase';
import MuxVideo from '@mux/mux-video-react';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Lekce({ slug }) {
	const router = useRouter();
	const [lekce, setLekce] = useState(null);
	const [playUrl, setPlayUrl] = useState(null);
	const [nacita, setNacita] = useState(true);

	useEffect(() => {
		const fetchLekceContent = async () => {
			const { data: lekce, error } = await supabase
				.from('lekce')
				.select(`*`)
				.eq('slug', slug)
				.single();
			if (!error) {
				setLekce(lekce);
				const user = await supabase.auth.getUser();
				if (user.data.user) {
					const { data } = await axios.post(
						'/api/ziskat-video-url',
						{
							data: {
								slug: slug,
								userid: user.data.user.id,
							},
						},
						{
							headers: {
								'Content-Type': 'application/json',
							},
						}
					);
					if (data.url) {
						setPlayUrl(data.url);
					}

					setNacita(false);
				} else {
					router.push('/auth/prihlasit');
				}
			} else {
				router.push('/lekce/neexistuje');
			}
		};

		fetchLekceContent();
	}, []);

	const handleZhlednuti = async () => {
		const { data: lekce } = await supabase
			.from('lekce')
			.select('id')
			.eq('slug', slug)
			.single();
		if (lekce) {
			const user = await supabase.auth.getUser();
			if (user.data.user) {
				const { data: pokrok } = await supabase
					.from('pokrok')
					.select('zhlednuto')
					.eq('profil', user.data.user.id)
					.eq('lekce', lekce.id)
					.single();
				if (!pokrok) {
					await supabase
						.from('pokrok')
						.insert([{ profil: user.data.user.id, lekce: lekce.id }]);
				}
			}
		}
	};

	return (
		<>
			{!nacita ? (
				<>
					<Head>
						<title>{lekce?.nazev}</title>
					</Head>
					<h1>{lekce?.nazev}</h1>
					<div style={{ width: '40vw', height: 'auto' }}>
						<MuxVideo
							onEnded={() => handleZhlednuti()}
							controls
							metadata={{
								video_id: lekce?.slug,
								video_title: lekce?.nazev,
							}}
							src={playUrl}
							type="hls"
						/>
					</div>
					<div dangerouslySetInnerHTML={{ __html: lekce?.obsah }} />
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
		props: { slug: slug },
	};
}
