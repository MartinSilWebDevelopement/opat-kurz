import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';

const Context = createContext();

const Provider = ({ children }) => {
	const router = useRouter();
	const [uzivatel, setUzivatel] = useState(null);
	const [nacita, setNacita] = useState(true);

	useEffect(() => {
		const ziskatUzivatelskyProfil = async () => {
			const user = await supabase.auth.getUser();
			if (user.data.user) {
				const { data: profil } = await supabase
					.from('profil')
					.select(`*, pokrok("*")`)
					.eq('id', user.data.user.id)
					.single();

				setUzivatel({
					...user.data.user,
					...profil,
				});
			}
			setNacita(false);
		};

		ziskatUzivatelskyProfil();
	}, []);

	useEffect(() => {
		if (uzivatel) {
			const profil = supabase
				.channel('custom-update-channel')
				.on(
					'postgres_changes',
					{
						event: 'UPDATE',
						schema: 'public',
						table: 'profil',
						filter: `id=eq.${uzivatel.id}`,
					},
					(payload) => {
						setUzivatel({ ...uzivatel, ...payload.new });
						router.reload()
					}
				)
				.subscribe();

			return () => {
				supabase.removeChannel(profil);
			};
		}
	}, [uzivatel]);

	const prihlasit = async (path) => {
		var url = '/auth/rozcestnik';
		if (path == 'rozcestnik') {
			url = '/auth/rozcestnik';
		} else {
			url = '/predplatit';
		}
		await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `${process.env.NEXT_PUBLIC_DOMAIN}${url}`,
			},
		});
	};
	const odhlasit = async () => {
		const res = await supabase.auth.signOut();
		console.log(res);
		if(res.error == null) {
			setUzivatel(null);
		}
		router.push('/');
	};

	const exposed = {
		uzivatel,
		prihlasit,
		odhlasit,
		nacita,
	};

	return <Context.Provider value={exposed}>{children}</Context.Provider>;
};

export const useUzivatel = () => useContext(Context);

export default Provider;
