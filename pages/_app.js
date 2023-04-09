import UzivatelProvider from '@/context/uzivatel';
import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
	return (
		<UzivatelProvider>
			<Component {...pageProps} />
		</UzivatelProvider>
	);
}
