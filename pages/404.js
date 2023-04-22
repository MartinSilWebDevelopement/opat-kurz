import styles from "@/styles/Error.module.css";
import Image from "next/image";
import opaterror from "@/public/opat404.webp"
import Link from "next/link";

export default function Error() {
   return (
      <section className={styles.sekce}>
         <div className={styles.sekce_box}>
            <span>Error 4<Image src={opaterror} alt="Opat 404" />4</span>
            <h1>Tato stránka neexistuje</h1>
            <Link href={"/"}>Domů</Link>
         </div>
      </section>
   )
}