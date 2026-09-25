import Link from "next/link";
import { Home, BadgePlus, LucideIcon } from "lucide-react";
import { Title } from "@mantine/core";
import ColorSchemes from "./colorSchemes";

type NavLinkProps = {
  href: string;
  icon: LucideIcon;
  title: string;
};

export const navLinks: NavLinkProps[] = [
  {
    href: "/",
    title: "Prestamos",
    icon: Home,
  },
  {
    href: "/crear-prestamo",
    title: "Nuevo",
    icon: BadgePlus,
  },
];

function Navbar() {
  return (
    <div className="w-full">
      <header className="hidden md:flex sticky top-0 z-40 w-full h-20 justify-between items-center px-6 md:px-10 bg-transparent backdrop-blur-sm">
        <div className="flex items-center">
          <Title className="text-2xl font-bold">LoansManager</Title>
        </div>
        <nav className="flex flex-row gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="link flex flex-row gap-2 items-center justify-center font-bold"
            >
              <link.icon />
              <span>{link.title}</span>
            </Link>
          ))}
        </nav>
        <ColorSchemes />
      </header>
      <div className="md:hidden">
        <div className="h-20 flex justify-between items-center px-6 bg-transparent backdrop-blur-sm">
          <Title className="text-xl font-bold">LoansManager</Title>
          <ColorSchemes />
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-bg-card/90 backdrop-blur-md border-t border-border">
          <nav className="flex flex-row w-full h-16 justify-around items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="link flex flex-col gap-1 items-center justify-center font-bold"
              >
                <link.icon />
                <span>{link.title}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
