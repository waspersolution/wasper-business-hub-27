
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/contexts/SessionContext";
import { supabase } from "@/integrations/supabase/client";

interface RequireAuthProps {
  children: React.ReactNode;
  requireCompany?: boolean;
}

export const RequireAuth = ({ children, requireCompany = true }: RequireAuthProps) => {
  const navigate = useNavigate();
  const { session } = useSession();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated
        const { data } = await supabase.auth.getSession();
        
        if (!data.session) {
          navigate("/login");
          return;
        }

        // If requireCompany is true, check if user has a company
        if (requireCompany) {
          const { data: roleAssignments } = await supabase
            .from('user_role_assignments')
            .select('company_id')
            .eq('user_id', data.session.user.id)
            .maybeSingle();
            
          if (!roleAssignments?.company_id) {
            navigate("/company-setup");
            return;
          }
        }

        setIsChecking(false);
      } catch (error) {
        console.error("Auth check failed:", error);
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate, requireCompany, session.isAuthenticated]);

  if (isChecking) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return <>{children}</>;
};
