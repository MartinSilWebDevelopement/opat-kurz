import Link from "next/link";
import { supabase } from "@/utils/supabase";

export default function Index() {
  console.log(supabase.auth.getUser())
  return (
    <Link href={"/auth/prihlasit"}>Registrovat/Přihlásit se</Link>
  )
}