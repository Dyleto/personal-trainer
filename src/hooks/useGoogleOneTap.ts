import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/config/api";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          prompt: (momentListener?: (notification: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean }) => void) => void;
          cancel: () => void;
        };
      };
    };
  }
}

export const useGoogleOneTap = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (!window.google) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: { credential: string }) => {
          try {
            const { data } = await api.post<{ user: unknown }>("/api/auth/google-onetap", {
              credential: response.credential,
            });
            setUser(data.user as never);
            navigate("/");
          } catch {
            // Silencieux — l'utilisateur peut toujours utiliser le bouton standard
          }
        },
        context: "signin",
        auto_select: true,
        cancel_on_tap_outside: false,
      });

      window.google.accounts.id.prompt();
    };

    document.head.appendChild(script);

    return () => {
      window.google?.accounts.id.cancel();
      document.head.removeChild(script);
    };
  }, [clientId, navigate, setUser]);
};
