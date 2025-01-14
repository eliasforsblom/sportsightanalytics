import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from "@/integrations/supabase/client"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Alert, AlertDescription } from "@/components/ui/alert"

const ADMIN_EMAILS = ['forsblomelias@gmail.com', 'john.ahlstedt.plym@gmail.com']

const AdminLogin = () => {
  const navigate = useNavigate()
  const [error, setError] = useState("")

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.email && ADMIN_EMAILS.includes(session.user.email)) {
        navigate("/admin/posts")
      }
    }
    
    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN") {
          const email = session?.user?.email
          if (email && ADMIN_EMAILS.includes(email)) {
            navigate("/admin/posts")
          } else {
            await supabase.auth.signOut()
            setError("Only admin users can access this area")
          }
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [navigate])

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
              button: { background: '#8E9196', color: 'white' },
              anchor: { color: '#8E9196' },
            },
          }}
          providers={[]}
        />
      </div>
    </div>
  )
}

export default AdminLogin