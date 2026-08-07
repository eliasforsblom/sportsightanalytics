import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Seo } from "@/components/Seo";

const ADMIN_EMAILS = ["forsblomelias@gmail.com", "john.ahlstedt.plym@gmail.com"];

const AdminLogin = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user?.email && ADMIN_EMAILS.includes(session.user.email)) {
        navigate("/admin/posts");
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== "SIGNED_IN") return;
      const email = session?.user?.email;
      if (email && ADMIN_EMAILS.includes(email)) {
        navigate("/admin/posts");
      } else {
        setTimeout(() => {
          void supabase.auth.signOut();
          setError("Only admin users can access this area");
        }, 0);
      }
    });

    checkSession();

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <>
      <Seo title="Admin sign in — SportSight Analytics" />
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-5">
          <div className="text-center">
            <Link to="/" className="inline-flex">
              <img
                src="/lovable-uploads/c029bee2-578d-4822-a0d2-4a13ae023b3d.png"
                alt="SportSight Analytics"
                className="h-9 w-auto brightness-0 invert"
              />
            </Link>
            <p className="eyebrow mt-5">Admin access</p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="surface-card p-6">
            <Auth
              supabaseClient={supabase}
              providers={[]}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: "hsl(165 66% 51%)",
                      brandAccent: "hsl(150 100% 73%)",
                      brandButtonText: "hsl(209 60% 7%)",
                      inputBackground: "transparent",
                      inputText: "hsl(160 20% 96%)",
                      inputBorder: "hsl(203 26% 20%)",
                      inputLabelText: "hsl(195 14% 64%)",
                      inputPlaceholder: "hsl(195 14% 45%)",
                      anchorTextColor: "hsl(195 14% 64%)",
                      anchorTextHoverColor: "hsl(165 66% 51%)",
                      messageText: "hsl(160 20% 96%)",
                      messageTextDanger: "hsl(358 72% 62%)",
                    },
                    radii: { borderRadiusButton: "999px", inputBorderRadius: "0.6rem" },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
