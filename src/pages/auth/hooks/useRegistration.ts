
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

      if (signUpError) {
        if (signUpError.message.includes("Email address")) {
          throw new Error("This email is already registered. Please use a different email or sign in.");
        }
        throw signUpError;
      }

      if (!authData.user) throw new Error("Failed to create user account");

      // 2. Create company with exact field names matching the database schema
      const { error: companyError, data: company } = await supabase
        .from('companies')
        .insert({
          name: data.companyName,
          created_by: authData.user.id,
          currency: data.currency,
          timezone: data.timezone,
          fiscal_year_start: data.fiscalYearStart.toISOString().split('T')[0],
          accounting_start: data.accountingStart.toISOString().split('T')[0],
        })
        .select()
        .single();

      if (companyError) {
        console.error("Company creation error:", companyError);
        throw new Error("Failed to create company. Please try again.");
      }

      // 3. Create main branch
      const { error: branchError } = await supabase
        .from('branches')
        .insert({
          name: 'Main Branch',
          company_id: company.id,
          is_main_branch: true,
        });

      if (branchError) {
        console.error("Branch creation error:", branchError);
        throw new Error("Failed to create branch. Please try again.");
      }

      // 4. Assign company_admin role
      const { error: roleError } = await supabase
        .from('user_role_assignments')
        .insert({
          user_id: authData.user.id,
          company_id: company.id,
          role: 'company_admin',
        });

      if (roleError) {
        console.error("Role assignment error:", roleError);
        throw new Error("Failed to assign user role. Please try again.");
      }

      // If logo was selected, upload it
      if (selectedLogo) {
        const fileExt = selectedLogo.name.split('.').pop();
        const filePath = `${company.id}/${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { error: storageError } = await supabase
          .storage
          .from('company-logos')
          .upload(filePath, selectedLogo);

        if (!storageError) {
          await supabase
            .from('companies')
            .update({
              logo_url: filePath
            })
            .eq('id', company.id);
        } else {
          console.error("Logo upload error:", storageError);
          // Don't fail the registration if just the logo upload fails
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
      console.error("Registration failed:", error);
      
      // Provide specific error message when possible
      let errorMessage = "Registration failed. Please try again.";
      
      if (error.message) {
        if (error.message.includes("Email address") || error.message.includes("already registered")) {
          errorMessage = "This email is already registered. Please use a different email or sign in.";
        } else if (error.message.includes("password")) {
          errorMessage = "Password must be at least 6 characters long.";
        } else {
          // Use the custom error message if we have one
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Registration failed",
        description: errorMessage,
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
