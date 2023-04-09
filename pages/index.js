import Link from "next/link";
import { supabase } from "@/utils/supabase";
import { useUzivatel } from '@/context/uzivatel';

export default function Index() {
  const { uzivatel } = useUzivatel();
	console.log({ uzivatel });
  return (
    <Link href={"/auth/prihlasit"}>Registrovat/Přihlásit se</Link>
  )
}