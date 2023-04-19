import { useUzivatel } from '@/context/uzivatel';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Prihlasit() {
	const { odhlasit } = useUzivatel();
	const router = useRouter()
	useEffect(() => {
		odhlasit();
	}, [router]);

	return <h1>Probíhá odhlašování</h1>;
}
