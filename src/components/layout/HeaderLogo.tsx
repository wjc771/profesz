
import { Link } from "react-router-dom";

export function HeaderLogo({ user }: { user: any }) {
  return (
    <Link to={user ? "/dashboard" : "/"} className="font-bold text-xl flex items-center gap-2">
      <span className="bg-primary text-primary-foreground p-1.5 rounded">PX</span>
      <span className="hidden md:inline">ProfeXpress</span>
    </Link>
  );
}
