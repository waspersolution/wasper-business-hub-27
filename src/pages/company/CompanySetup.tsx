
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { startOfYear } from "date-fns";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@/contexts/SessionContext";
import { supabase } from "@/integrations/supabase/client";
import { companySchema, CompanyFormValues } from "./schemas/companySchema";
import { CurrencySelect } from "../auth/components/accounting-settings/CurrencySelect";
import { DateFields } from "../auth/components/accounting-settings/DateFields";
import { TimezoneSelect } from "../auth/components/accounting-settings/TimezoneSelect";

const CompanySetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session, setSession } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  
  const fiscalYearStart = startOfYear(new Date());
  const accountingStart = new Date();

  useEffect(() => {
    // Redirect to dashboard if user already has a company
    if (session.currentCompanyId) {
      navigate("/dashboard");
    }
  }, [session, navigate]);

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

      // 3. Assign company_admin role
      const { error: roleError } = await supabase
        .from('user_role_assignments')
        .insert({
          user_id: session.userId,
          company_id: company.id,
          role: 'company_admin',
        });

      if (roleError) {
        console.error("Role assignment error:", roleError);
        throw new Error("Failed to assign user role. Please try again.");
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-wasper-primary">Wasper Business Hub</h1>
          <p className="text-gray-600 mt-2">Set up your company</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Company Setup</CardTitle>
            <CardDescription>
              Create your business profile to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your Business Name" 
                            {...field} 
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div>
                    <FormLabel>Company Logo (Optional)</FormLabel>
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleLogoChange} 
                      disabled={isLoading}
                      className="mt-1"
                    />
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-medium">Accounting Settings</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <CurrencySelect form={form} isLoading={isLoading} />
                      <TimezoneSelect form={form} isLoading={isLoading} />
                    </div>
                    
                    <DateFields form={form} isLoading={isLoading} />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-wasper-secondary text-white hover:bg-wasper-accent"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating company..." : "Create Company"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              You'll be able to add team members after creating your company
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CompanySetup;
