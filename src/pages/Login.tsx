
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "@/contexts/SessionContext";

// Form validation schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, setSession } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [message] = useState<string | undefined>(
    location.state?.message
  );

  // Show message from redirect if present
  useEffect(() => {
    if (message) {
      toast({
        title: "Notice",
        description: message,
      });
    }
  }, [message, toast]);

  // If logged in already
  useEffect(() => {
    if (session.isAuthenticated) {
      // Check if user has a company
      const checkUserCompany = async () => {
        const { data, error } = await supabase
          .from('user_role_assignments')
          .select('company_id')
          .eq('user_id', session.userId)
          .maybeSingle();

        if (!error && data?.company_id) {
          navigate('/dashboard');
        } else if (session.isAuthenticated) {
          // User is logged in but has no company
          navigate('/company-setup');
        }
      };
      
      checkUserCompany();
    }
  }, [session, navigate]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      // Get user's role assignments
      const { data: roleAssignments, error: roleError } = await supabase
        .from('user_role_assignments')
        .select('role, company_id, branch_id')
        .eq('user_id', authData.user.id)
        .maybeSingle();

      // Set session context with user info
      setSession({
        userId: authData.user.id,
        currentCompanyId: roleAssignments?.company_id || '',
        currentBranchId: roleAssignments?.branch_id || '',
        currentRole: roleAssignments?.role as any || 'staff',
        isAuthenticated: true,
      });
      
      // Redirect to dashboard if user has a company, otherwise to company setup
      if (roleAssignments?.company_id) {
        navigate("/dashboard");
      } else {
        navigate("/company-setup");
      }
    } catch (error: any) {
      console.error("Login failed", error);
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-wasper-primary">Wasper Business Hub</h1>
          <p className="text-gray-600 mt-2">Login to manage your business</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="you@example.com" 
                          {...field} 
                          disabled={isLoading}
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="********" 
                          {...field} 
                          disabled={isLoading}
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-wasper-secondary text-white hover:bg-wasper-accent"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-wasper-secondary font-medium hover:underline">
                Register
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

export default Login;
