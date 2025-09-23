import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const logout = async () => {
    try {
      // Llamar al endpoint de logout del backend si existe un token
      if (session?.accessToken) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Error en logout del backend:", error);
    } finally {
      // Cerrar sesión en NextAuth
      await signOut({
        callbackUrl: "/login",
        redirect: false,
      });
      router.push("/login");
    }
  };

  return {
    user: session?.user,
    accessToken: session?.accessToken,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    logout,
  };
};
