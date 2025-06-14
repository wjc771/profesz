
import { Link } from "react-router-dom";

export function HeaderLogo({ user }: { user: any }) {
  return (
    <Link to={user ? "/dashboard" : "/"} className="font-bold text-xl flex items-center gap-2">
      <img src="/lovable-uploads/c36b1c8e-bb9e-4e4e-9a44-98fd7b4f15a6.png" alt="Profzi Logo" className="h-8 w-8" />
      <span className="hidden md:inline">Profzi</span>
    </Link>
  );
}
