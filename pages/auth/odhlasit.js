import { supabase } from '@/utils/supabase';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Prihlasit() {
   const router = useRouter();
	useEffect(() => {
		const logout = async () => {
         await supabase.auth.signOut();
         router.push('/')
      }
      logout();
	}, []);

	return <h1>Probíhá odhlašování</h1>;
}
