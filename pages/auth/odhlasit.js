import Loading from '@/components/loading';
import { useUzivatel } from '@/context/uzivatel';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Prihlasit() {
	const { odhlasit } = useUzivatel();
	const router = useRouter();
	useEffect(() => {
		const fetchLogout = async () => {
			await odhlasit();
		};
		fetchLogout();
	}, [router]);

	return (
		<div style={{height: "100vh"}}>
			<Loading />
		</div>
	);
}
