import { useUzivatel } from '@/context/uzivatel';
import { useEffect } from 'react';

export default function Prihlasit() {
	const { odhlasit } = useUzivatel();
	useEffect(() => {
		odhlasit();
	}, []);

	return <h1>Probíhá odhlašování</h1>;
}
