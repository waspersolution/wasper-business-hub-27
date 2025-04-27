
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RegisterFormValues } from "../schemas/registerSchema";

export function useRegistration() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedLogo(event.target.files[0]);
    }
  };

  const handleRegistration = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      // 1. Sign up the user with Supabase
      const { error: signUpError, data: authData } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          }
        }
      });

      if (signUpError) throw signUpError;

      if (!authData.user) throw new Error("Failed to create user");

      // 2. Create company - Ensure property names match exactly with database schema
      const { error: companyError, data: company } = await supabase
        .from('companies')
        .insert({
          // Use the exact column names from the Supabase table schema
          name: data.companyName,
          created_by: authData.user.id,
          currency: data.currency,
          timezone: data.timezone,
          fiscal_year_start: data.fiscalYearStart.toISOString().split('T')[0],
          accounting_start: data.accountingStart.toISOString().split('T')[0],
        })
        .select()
        .single();

      if (companyError) throw companyError;

      // 3. Create main branch
      const { error: branchError } = await supabase
        .from('branches')
        .insert({
          name: 'Main Branch',
          company_id: company.id,
          is_main_branch: true,
        });

      if (branchError) throw branchError;

      // 4. Assign company_admin role
      const { error: roleError } = await supabase
        .from('user_role_assignments')
        .insert({
          user_id: authData.user.id,
          company_id: company.id,
          role: 'company_admin',
        });

      if (roleError) throw roleError;

      // If logo was selected, upload it
      if (selectedLogo) {
        const { error: storageError } = await supabase
          .storage
          .from('company-logos')
          .upload(`${company.id}/${selectedLogo.name}`, selectedLogo);

        if (!storageError) {
          // Update company with logo URL
          await supabase
            .from('companies')
            .update({
              logo_url: `${company.id}/${selectedLogo.name}`
            })
            .eq('id', company.id);
        }
      }

      // Registration successful
      toast({
        title: "Registration successful!",
        description: "Please sign in with your credentials.",
      });
      
      navigate("/login", { 
        state: { message: "Registration successful! Please sign in." } 
      });
    } catch (error: any) {
      console.error("Registration failed", error);
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleRegistration,
    handleLogoChange,
  };
}
