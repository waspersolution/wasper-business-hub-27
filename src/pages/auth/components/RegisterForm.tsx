
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { startOfYear } from "date-fns";
import { CompanyDetailsForm } from "./CompanyDetailsForm";
import { AccountingSettingsForm } from "./AccountingSettingsForm";
import { registerSchema, type RegisterFormValues } from "../schemas/registerSchema";

interface RegisterFormProps {
  isLoading: boolean;
  onSubmit: (data: RegisterFormValues) => void;
  handleLogoChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function RegisterForm({ isLoading, onSubmit, handleLogoChange }: RegisterFormProps) {
  const currentYear = new Date().getFullYear();
  const fiscalYearStart = startOfYear(new Date());
  const accountingStart = new Date();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      companyName: "",
      currency: "NGN",
      timezone: "Africa/Lagos",
      fiscalYearStart: fiscalYearStart,
      accountingStart: accountingStart,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <CompanyDetailsForm form={form} isLoading={isLoading} />
        <AccountingSettingsForm 
          form={form} 
          isLoading={isLoading}
          handleLogoChange={handleLogoChange}
        />
        <Button 
          type="submit" 
          className="w-full bg-wasper-secondary text-white hover:bg-wasper-accent"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>
      </form>
    </Form>
  );
}
