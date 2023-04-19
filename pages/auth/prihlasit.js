import { useUzivatel } from '@/context/uzivatel';

export default function Prihlasit() {
	const { prihlasit } = useUzivatel();
	
	return (
		<>
			<h1>Přihlásit se</h1>
			<button onClick={() => prihlasit()}>Log in with Google</button>
		</>
	);
}
