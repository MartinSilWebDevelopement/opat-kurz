import { supabase } from '@/utils/supabase';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Rozcestnik() {
	const router = useRouter();
	useEffect(() => {
		const fetchUser = async () => {
			const user = await supabase.auth.getUser();
			if (user.data.user) {
				const { data: profil } = await supabase
					.from('profil')
					.select('odebira')
					.eq('id', user.data.user.id)
					.single();
            if(profil) {
               if(profil.odebira) {
                  router.push("/home");
               } else {
                  router.push("/#pridat-se");
               }
            }
			} else {
            router.push("/auth/prihlasit");
         }
		};
		fetchUser();
	}, []);
	return (
		<>
			<Head>
				<title>Přihlašování...</title>
			</Head>
         <h1>Přihlašování...</h1>
		</>
	);
}
