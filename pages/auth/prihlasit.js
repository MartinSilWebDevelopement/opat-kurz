import { useUzivatel } from '@/context/uzivatel';
import { useEffect } from 'react';

export default function Prihlasit() {
	const { prihlasit } = useUzivatel();
	useEffect(() => {
		prihlasit();
	}, []);

	return <h1>Probíhá přihlašování</h1>;
}
