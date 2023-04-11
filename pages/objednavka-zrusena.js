import Link from "next/link"

export default function ObjednavkaZrusena() {
   return (
      <section>
         <h1>Objednávka zrušena, nebyl jsi zpoplatněn</h1>
         <Link href={"/"}>Zůstat špatný</Link>
      </section>
   )
}