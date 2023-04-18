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
					.from("profil")
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
	}, [router]);

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
					}
				)
				.subscribe();

			return () => {
				supabase.removeChannel(profil);
			};
		}
	}, [uzivatel]);

	const prihlasit = async () => {
		await supabase.auth.signInWithOAuth({
			provider: 'google',
		});
	};
	const odhlasit = async () => {
		await supabase.auth.signOut();
		setUzivatel(null);
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
