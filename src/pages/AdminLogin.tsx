import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email === "forsblomelias@gmail.com") {
        navigate("/admin/posts");
      }
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN") {
          const email = session?.user?.email;
          if (email === "forsblomelias@gmail.com") {
            navigate("/admin/posts");
          } else {
            await supabase.auth.signOut();
            setError("Only admin users can access this area");
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            style: {
              button: {
                background: 'rgb(var(--primary))',
                color: 'white',
                borderRadius: '0.375rem',
              },
              anchor: {
                color: 'rgb(var(--primary))',
              },
            },
          }}
          providers={[]}
        />
      </div>
    </div>
  );
};

export default AdminLogin;