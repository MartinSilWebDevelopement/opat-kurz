import { useUzivatel } from '@/context/uzivatel';
import googleicon from '@/public/google-icon.webp';
import style from '@/styles/Auth.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function Prihlasit() {
	const { prihlasit } = useUzivatel();

	return (
		<section>
			<header className={style.header}>
				<Link href={'/'}>
					<FaArrowLeft size={22} />
					Domů
				</Link>
				<span>OPAT04</span>
				<div></div>
			</header>
			<div className={style.loginbox_area}>
				<div className={style.loginbox}>
					<h1>
						Přihlášení<span>/</span>Registrace
					</h1>
					<button onClick={() => prihlasit("rozcestnik")}>
						<Image width={30} height={30} src={googleicon} alt="Google logo" />
						Pokračovat s Google
					</button>
				</div>
			</div>
		</section>
	);
}
