
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSession } from "@/contexts/SessionContext";

const NotFound = () => {
  const location = useLocation();
  const { session } = useSession();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Determine where to redirect based on authentication status
  const redirectPath = session.isAuthenticated ? "/dashboard" : "/login";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-4">
        <h1 className="text-5xl font-bold mb-4 text-wasper-primary">404</h1>
        <p className="text-xl text-gray-600 mb-6">The page you're looking for doesn't exist</p>
        <Button asChild className="bg-wasper-secondary hover:bg-wasper-accent">
          <Link to={redirectPath}>
            {session.isAuthenticated ? "Back to Dashboard" : "Go to Login"}
          </Link>
        </Button>
        <div className="mt-8 text-sm text-gray-500">
          powered by waspersolution.com
        </div>
      </div>
    </div>
  );
};

export default NotFound;
