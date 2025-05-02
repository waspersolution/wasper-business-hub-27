
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { CompanyFormValues } from "../schemas/companySchema";

interface CompanyNameFieldProps {
  form: UseFormReturn<CompanyFormValues>;
  isLoading: boolean;
}

export const CompanyNameField = ({ form, isLoading }: CompanyNameFieldProps) => {
  return (
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
  );
};
