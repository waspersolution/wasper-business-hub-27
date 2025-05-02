
import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form";

interface CompanyLogoUploadProps {
  handleLogoChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
}

export const CompanyLogoUpload = ({ handleLogoChange, isLoading }: CompanyLogoUploadProps) => {
  return (
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
  );
};
