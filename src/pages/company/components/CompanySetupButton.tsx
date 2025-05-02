
import { Button } from "@/components/ui/button";

interface CompanySetupButtonProps {
  isLoading: boolean;
}

export const CompanySetupButton = ({ isLoading }: CompanySetupButtonProps) => {
  return (
    <Button 
      type="submit" 
      className="w-full bg-wasper-secondary text-white hover:bg-wasper-accent"
      disabled={isLoading}
    >
      {isLoading ? "Creating company..." : "Create Company"}
    </Button>
  );
};
