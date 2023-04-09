import { supabase } from '@/utils/supabase';
import { useEffect } from 'react';

export default function Prihlasit() {
	useEffect(() => {
		supabase.auth.signInWithOAuth({
			provider: 'google',
		});
	}, []);

	return <h1>Probíhá přihlašování</h1>;
}
