
import { Link } from "react-router-dom";

export function HeaderLogo({ user }: { user: any }) {
  return (
    <Link to={user ? "/dashboard" : "/"} className="font-bold text-xl flex items-center gap-2">
      <img src="/lovable-uploads/4ef9779b-e5f9-48f1-b21b-1557995e0fff.png" alt="Profzi Logo" className="h-8 w-8" />
      <span className="hidden md:inline">Profzi</span>
    </Link>
  );
}
