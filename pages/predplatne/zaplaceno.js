import style from '@/styles/Predplatne.module.css';
import Link from 'next/link';
import Image from 'next/image';
import opatlove from "@/public/opat-love.webp"

export default function UspesnePredplaceno() {
	return (
		<section className={style.sekce}>
			<div className={style.sekce_box}>
				<span>Děkuji za předplacení <Image width={40} height={40} src={opatlove} alt='Opat love emotikon' /></span>
            <h1>Platba proběhla úspěšně</h1>
				<Link href={'/feed'}>Zobrazit feed</Link>
			</div>
		</section>
	);
}
