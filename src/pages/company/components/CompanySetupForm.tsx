
import { UseFormReturn } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { CompanyFormValues } from "../schemas/companySchema";
import { CompanyNameField } from "./CompanyNameField";
import { CompanyLogoUpload } from "./CompanyLogoUpload";
import { CurrencySelect } from "../../auth/components/accounting-settings/CurrencySelect";
import { TimezoneSelect } from "../../auth/components/accounting-settings/TimezoneSelect";
import { DateFields } from "../../auth/components/accounting-settings/DateFields";
import { CompanySetupButton } from "./CompanySetupButton";

interface CompanySetupFormProps {
  form: UseFormReturn<CompanyFormValues>;
  isLoading: boolean;
  handleLogoChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (data: CompanyFormValues) => Promise<void>;
}

export const CompanySetupForm = ({ 
  form, 
  isLoading, 
  handleLogoChange, 
  onSubmit 
}: CompanySetupFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <CompanyNameField form={form} isLoading={isLoading} />
          
          <CompanyLogoUpload 
            handleLogoChange={handleLogoChange} 
            isLoading={isLoading} 
          />

          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-medium">Accounting Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CurrencySelect form={form} isLoading={isLoading} />
              <TimezoneSelect form={form} isLoading={isLoading} />
            </div>
            
            <DateFields form={form} isLoading={isLoading} />
          </div>
        </div>
        
        <CompanySetupButton isLoading={isLoading} />
      </form>
    </Form>
  );
};
