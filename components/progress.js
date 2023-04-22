import Loading from '@/components/loading';
import { useUzivatel } from '@/context/uzivatel';
import style from '@/styles/Progress.module.css';
import { supabase } from '@/utils/supabase';
import { useEffect, useState } from 'react';

export default function Progress() {
	const { uzivatel } = useUzivatel();
	const [pocetLekci, setPocetLekci] = useState();
	const [pocetZhlednuti, setPocetZhlednuti] = useState();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchProgress = async () => {
			const { data: lekce } = await supabase.from('lekce').select('id');
			setPocetLekci(lekce);
			const user = await supabase.auth.getUser();
			if (user.data.user) {
				const { data: pokrok } = await supabase
					.from('pokrok')
					.select('id')
					.eq('profil', user.data.user.id);
				setPocetZhlednuti(pokrok.length);
			}
			setIsLoading(false);
		};
		fetchProgress();
	}, []);

	return (
		<div className={style.sekce}>
			{isLoading ? (
				<Loading />
			) : (
				<div className={style.progress}>
					<div className={style.number}>
						<h2>
							<span>{pocetZhlednuti}</span> / {pocetLekci.length}
						</h2>
					</div>
					<div className={style.progress_bar}>
                  <div style={{width: (100 / pocetLekci.length) * pocetZhlednuti + "%" }} className={style.progress_width}></div>
               </div>
				</div>
			)}
		</div>
	);
}
