
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { CompanyFormValues } from "../../company/schemas/companySchema";
import { DateFields } from "./accounting-settings/DateFields";
import { CurrencySelect } from "./accounting-settings/CurrencySelect";
import { TimezoneSelect } from "./accounting-settings/TimezoneSelect";
import { useState } from "react";

interface AccountingSettingsFormProps {
  form: UseFormReturn<CompanyFormValues>;
  isLoading: boolean;
  handleLogoChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AccountingSettingsForm({ 
  form, 
  isLoading,
  handleLogoChange 
}: AccountingSettingsFormProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleLogoChange(e);
    
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <DateFields form={form} isLoading={isLoading} />
      <CurrencySelect form={form} isLoading={isLoading} />
      <TimezoneSelect form={form} isLoading={isLoading} />
      
      <FormField
        control={form.control}
        name="logo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Upload Logo</FormLabel>
            <FormControl>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      handleFileChange(e);
                      field.onChange(e.target.files?.[0]);
                    }}
                    className="cursor-pointer"
                    disabled={isLoading}
                  />
                </div>
                <Avatar className="h-12 w-12">
                  {logoPreview ? (
                    <AvatarImage src={logoPreview} alt="Logo preview" />
                  ) : (
                    <AvatarFallback>
                      <Upload className="h-5 w-5 text-gray-400" />
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
            </FormControl>
            <FormDescription>
              Optional: Upload your company logo (PNG, JPG up to 2MB)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
