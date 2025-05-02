
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RegisterFormValues } from "../schemas/registerSchema";

export function useRegistration() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegistration = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      // Sign up the user with Supabase
      const { error: signUpError, data: authData } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          }
        }
      });

      if (signUpError) {
        if (signUpError.message.includes("Email address")) {
          throw new Error("This email is already registered. Please use a different email or sign in.");
        }
        throw signUpError;
      }

      if (!authData.user) throw new Error("Failed to create user account");

      // Registration successful
      toast({
        title: "Registration successful!",
        description: "Please sign in with your credentials.",
      });
      
      navigate("/login", { 
        state: { message: "Registration successful! Please sign in." } 
      });
    } catch (error: any) {
      console.error("Registration failed:", error);
      
      let errorMessage = "Registration failed. Please try again.";
      
      if (error.message) {
        if (error.message.includes("Email address") || error.message.includes("already registered")) {
          errorMessage = "This email is already registered. Please use a different email or sign in.";
        } else if (error.message.includes("password")) {
          errorMessage = "Password must be at least 6 characters long.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleRegistration,
  };
}
