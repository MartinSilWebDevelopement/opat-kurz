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
					.select('*')
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
