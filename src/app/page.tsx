import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard");

  // Esto nunca se renderizará debido a la redirección
  return null;
}
