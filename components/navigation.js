import style from '@/styles/Navigation.module.css';
import Link from 'next/link';
import { MdManageAccounts } from 'react-icons/md';

export default function Navigation() {
	return (
		<header className={style.header}>
			<nav>
				<span>Opat04</span>
				<ul>
					<li>
						<Link href={'/feed'}>Feed</Link>
					</li>
				</ul>
			</nav>
			<div className={style.panel_cta}>
				<Link href={'/ucet/profil'}>
					<MdManageAccounts size={30} />
				</Link>
				<Link href={'/auth/odhlasit'}>Odhlásit se</Link>
			</div>
		</header>
	);
}
