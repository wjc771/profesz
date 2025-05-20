
import { Link } from "react-router-dom";

export function HeaderLogo({ user }: { user: any }) {
  return (
    <Link to={user ? "/dashboard" : "/"} className="font-bold text-xl flex items-center gap-2">
      <img src="/lovable-uploads/d1692790-1887-44f3-9157-6cd1ade4b2a6.png" alt="ProfesZ Logo" className="h-8 w-8" />
      <span className="hidden md:inline">ProfesZ</span>
    </Link>
  );
}
