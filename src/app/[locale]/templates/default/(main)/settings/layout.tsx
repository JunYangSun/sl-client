import { Wrench, UserCog } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/components/common/sidebar-nav";

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/settings",
    icon: <UserCog size={18} />,
    desc: "This is how others will see you on the site.",
  },
  {
    title: "Account",
    href: "/settings/account",
    icon: <Wrench size={18} />,
    desc: "Update your account settings. Set your preferred language and timezone.",
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const current = sidebarNavItems[0];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4">
        <Separator className="my-4 lg:my-6" />
        <SidebarNav
          items={sidebarNavItems}
          layout
          title={current.title}
          desc={current.desc}
        >
          {children as React.JSX.Element}
        </SidebarNav>
      </div>
    </div>
  );
}
