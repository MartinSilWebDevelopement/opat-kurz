import style from '@/styles/Predplatne.module.css';
import Link from 'next/link';

export default function ObjednavkaZrusena() {
	return (
		<section className={style.sekce}>
			<div className={style.sekce_box}>
				<span>Nebyl jsi zpoplatněn</span>
				<h1>Objednávka zrušena</h1>

				<Link href={'/feed'}>zpět domů</Link>
			</div>
		</section>
	);
}
