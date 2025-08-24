// @ts-nocheck
import React from "react";
import { File, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";

import { getSettings } from "@/api/settings";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Icons } from "@/components/icons";

import { Nav } from "../../_page/Nav";
import {
  Link,
  Outlet,
  useNavigate,
  useRouteLoaderData,
} from "react-router-dom";
import { logout } from "@/utils/auth";

import { useSettings } from "@/zustand/useSettingsStore";

const navItems: any = [
  {
    title: "Payment Details",
    label: "",
    icon: File,
    variant: "ghost",
    href: "/vendor-portal/payment-details",
    roles: ["vendor"],
  },
];

// TODO: what is it for? i don't remember
const useOnClickOutside = (ref, handler) => {
  React.useEffect(() => {
    const listener = (event) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

export const Root = ({}) => {
  useSettings();

  const [isToggleMenu, setIsToggleMenu] = React.useState(false);
  const navigate = useNavigate();
  const ref = React.useRef();
  const { authUser } = useRouteLoaderData("root");

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login");
  };

  const handleToggleMenu = () => {
    setIsToggleMenu(!isToggleMenu);
  };

  useOnClickOutside(ref, () => {
    setIsToggleMenu(false);
  });

  return (
    <TooltipProvider delayDuration={0}>
      <div className="">
        <div className="flex gap-2">
          <div
            ref={ref}
            className={`flex flex-col pb-4 min-w-[360px] min-h-[100vh] w-[360px] h-[100vh] z-40 bg-white fixed transition-transform md:translate-x-0 ${
              isToggleMenu ? "" : "-translate-x-full"
            }`}
          >
            <ScrollArea>
              <div className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary md:hidden">
                <button onClick={handleToggleMenu}>
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div
                className={cn(
                  "flex items-center justify-center gap-4 py-6",
                  "px-6"
                )}
              >
                <img
                  src="/logo.png"
                  alt="logo"
                  className={"h-[32px]"}
                  width="auto"
                />
                <img
                  src={settings?.logo}
                  alt="logo"
                  className={"h-[48px]"}
                  width="auto"
                />
              </div>

              <Nav links={navItems} />

              <div className="grow"></div>
              <div className="p-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="w-[100px] flex items-center gap-2 cursor-pointer">
                      <Avatar className="cursor-pointer">
                        <AvatarImage src={authUser.picture} />
                        <AvatarFallback>{authUser.name?.[0]}</AvatarFallback>
                      </Avatar>
                      <span>{authUser.name}</span>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 mx-4" side="top">
                    <DropdownMenuItem asChild>
                      <Link to="/vendor-portal/profile" className="w-full">
                        <span>Your profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <div
                        className="cursor-pointer w-full"
                        onClick={handleLogout}
                      >
                        Sign out
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </ScrollArea>
          </div>

          <div className="md:ml-[360px] bg-[#faf8f5] min-h-[100vh] w-full md:min-w-[calc(100vw-360px)] flex flex-col">
            <div className="flex items-center border-b-2">
              <Button
                className="md:hidden mx-4 px-2"
                onClick={handleToggleMenu}
              >
                <Icons.mobileMenu />
              </Button>
              <div
                id="header-container"
                className="h-[52px] flex justify-between items-center px-4 py-2 w-full"
              ></div>
            </div>
            <div className="grow">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
