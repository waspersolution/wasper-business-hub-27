
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { startOfYear } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@/contexts/SessionContext";
import { supabase } from "@/integrations/supabase/client";
import { companySchema, CompanyFormValues } from "../schemas/companySchema";

export const useCompanySetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session, setSession } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  
  const fiscalYearStart = startOfYear(new Date());
  const accountingStart = new Date();

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyName: "",
      currency: "NGN",
      timezone: "Africa/Lagos",
      fiscalYearStart: fiscalYearStart,
      accountingStart: accountingStart,
    },
  });

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedLogo(event.target.files[0]);
      form.setValue('logo', event.target.files[0]);
    }
  };

  const onSubmit = async (data: CompanyFormValues) => {
    if (!session.userId) {
      toast({
        title: "Not authenticated",
        description: "Please sign in to create a company",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 1. Create company
      const { error: companyError, data: company } = await supabase
        .from('companies')
        .insert({
          name: data.companyName,
          created_by: session.userId,
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

      if (!company) throw new Error("Company creation failed");

      // 2. Create main branch
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

      // 3. Use direct SQL RPC to avoid role assignment issues
      // This avoids the infinite recursion in RLS policies
      const { error: roleError } = await supabase.rpc('assign_company_admin_role', {
        user_uuid: session.userId,
        company_uuid: company.id
      });

      if (roleError) {
        console.error("Role assignment error:", roleError);
        // Don't throw an error here, try to proceed anyway
      }

      // Handle logo upload if provided
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

      // Update session with company info
      setSession({
        ...session,
        currentCompanyId: company.id,
        currentRole: 'company_admin',
      });

      toast({
        title: "Company created successfully!",
        description: "You're all set to start using Wasper Business Hub.",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Company creation failed:", error);
      
      toast({
        title: "Company creation failed",
        description: error.message || "Failed to create company. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    handleLogoChange,
    onSubmit
  };
};
