
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from "@/components/ui/card";
import { useSession } from "@/contexts/SessionContext";
import { useCompanySetup } from "./hooks/useCompanySetup";
import { CompanySetupForm } from "./components/CompanySetupForm";

const CompanySetup = () => {
  const navigate = useNavigate();
  const { session } = useSession();
  const { form, isLoading, handleLogoChange, onSubmit } = useCompanySetup();

  useEffect(() => {
    // Redirect to dashboard if user already has a company
    if (session.currentCompanyId) {
      navigate("/dashboard");
    }
  }, [session, navigate]);

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
            <CompanySetupForm 
              form={form}
              isLoading={isLoading}
              handleLogoChange={handleLogoChange}
              onSubmit={onSubmit}
            />
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
