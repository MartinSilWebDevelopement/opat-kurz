import { AiOutlineLoading } from "react-icons/ai";
import styles from '@/styles/Loading.module.css';

export default function Loading() {
	return (
		<div className={styles.loadingsection}>
			<span>
				<AiOutlineLoading size={50} className={styles.spinner} />
			</span>
		</div>
	);
}
