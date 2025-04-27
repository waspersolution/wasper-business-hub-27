
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RegisterForm } from "./auth/components/RegisterForm";
import { useRegistration } from "./auth/hooks/useRegistration";

const Register = () => {
  const { isLoading, handleRegistration, handleLogoChange } = useRegistration();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-wasper-primary">Wasper Business Hub</h1>
          <p className="text-gray-600 mt-2">Create your account to get started</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>
              Create an account for your business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm 
              isLoading={isLoading}
              onSubmit={handleRegistration}
              handleLogoChange={handleLogoChange}
            />
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-wasper-secondary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
        
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            powered by waspersolution.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
