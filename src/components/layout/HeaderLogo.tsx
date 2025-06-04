
import { Link } from "react-router-dom";

export function HeaderLogo({ user }: { user: any }) {
  return (
    <Link to={user ? "/dashboard" : "/"} className="font-bold text-xl flex items-center gap-2">
      <img src="/lovable-uploads/b489d34a-efd0-4cdb-b9c6-3390f0fcfcb2.png" alt="PROFZi Logo" className="h-8 w-8" />
      <span className="hidden md:inline">PROFZi</span>
    </Link>
  );
}
