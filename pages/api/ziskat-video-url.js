import { getServiceSupabase } from '@/utils/supabase';
import Mux from '@mux/mux-node';

const handler = async (req, res) => {
	if (req.method === 'POST') {
		const { slug, userid } = req.body;

		if (!slug) {
			return res.status(400).json({
				error: 'Nebyl poslán slug',
			});
		}
		if (!userid) {
			return res.status(401).json({
				error: 'Nebyl poslán uživatel',
			});
		}

		const supabase = getServiceSupabase();
      
      const { data: profil } = await supabase.from("profil").select("odebira").eq("id", userid).single();
      if(!profil.odebira) {
         return res.status(401).json({
				error: 'Tento uživatel nemá aktivní odběr',
			});
      }

		const { data: lekce } = await supabase
			.from('lekce')
			.select('playback_id')
			.eq('slug', slug)
			.single();

		if (lekce.playback_id) {
			const playbackId = lekce.playback_id;

			const token = Mux.JWT.signPlaybackId(playbackId, {
				keyId: process.env.MUX_SECRET_KEY_ID,
				keySecret: process.env.MUX_SECRET_BASE,
			});
			const videourl = `https://stream.mux.com/${lekce.playback_id}.m3u8?token=${token}`;

			return res.status(200).json({
				url: videourl,
			});
		} else {
			return res.status(400).json({
				error: 'K tomuto slugu neexistuje playback ID',
			});
		}
	} else {
		return res.status(405).json({
			error: 'Tato metoda požadavku není povolena',
		});
	}
};

export default handler;
