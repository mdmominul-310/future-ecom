"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import BrandLogo from "@/components/common/BrandLogo";
import { usePathname } from "next/navigation";

import {
  Book,
  BoxIcon,
  // CalendarCheck,
  ChevronDownIcon,
  Ellipsis,
  GridIcon,
  LayoutList,
  MessageSquareMore,
  Paintbrush,
  PieChart,
  Plug,
  Ruler,
  Settings,
  Shapes,
  ShoppingCart,
  // UserCircleIcon,
  Users,
  // Zap,
  // Zap,
} from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import { FaComment } from "react-icons/fa6";
// import { FaComment } from "react-icons/fa6";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/dashboard",
    // subItems: [{ name: "Ecommerce", path: "/dashboard", pro: false }],
  },
  {
    icon: <ShoppingCart />,
    name: "Orders",
    path: "/dashboard/orders",
    // subItems: [{ name: "Ecommerce", path: "/dashboard", pro: false }],
  },
  {
    icon: <LayoutList />,
    name: "Products",
    path: "/dashboard/products",
    // subItems: [{ name: "Ecommerce", path: "/dashboard", pro: false }],
  },
  {
    icon: <Shapes />,
    name: "Categories",
    path: "/dashboard/categories",
    // subItems: [{ name: "Ecommerce", path: "/dashboard", pro: false }],
  },

  {
    icon: <Paintbrush />,
    name: "Colors",
    path: "/dashboard/colors",
    // subItems: [{ name: "Ecommerce", path: "/dashboard", pro: false }],
  },

  {
    icon: <Ruler />,
    name: "Sizes",
    path: "/dashboard/sizes",
    // subItems: [{ name: "Ecommerce", path: "/dashboard", pro: false }],
  },
  {
    icon: <Users />,
    name: "Users",
    path: "/dashboard/users",
  },
  {
    icon: <MessageSquareMore />,
    name: "Messages",
    path: "/dashboard/messages",
  },

  {
    icon: <Book />,
    name: "Blogs",
    path: "/dashboard/blogs",
  },

  // {
  //   icon: <Zap />,
  //   name: "Landing Pages",
  //   path: "/dashboard/landingpages",
  //   // subItems: [{ name: "Ecommerce", path: "/dashboard", pro: false }],
  // },
  {
    icon: <FaComment />,
    name: "Reviews",
    path: "/dashboard/reviews",
    // subItems: [{ name: "Ecommerce", path: "/dashboard", pro: false }],
  },
  // {
  //   icon: <UserCircleIcon />,
  //   name: "User Profile",
  //   path: "/dashboard/profile",
  // },
  {
    icon: <Settings />,
    name: "Settings",
    path: "/dashboard/settings",
    subItems: [
      { name: "General & Branding", path: "/dashboard/settings/general", pro: false },
      { name: "Analytics & Pixels", path: "/dashboard/settings/general", pro: false },
      { name: "Hero Banners", path: "/dashboard/settings/hero-banner-management", pro: false },
      { name: "Timer Banners", path: "/dashboard/settings/timer-banner-management", pro: false },
    ],
  },
];

const othersItems: NavItem[] = [
  {
    icon: <PieChart />,
    name: "Charts",
    subItems: [
      { name: "Line Chart", path: "/dashboard/line-chart", pro: false },
      { name: "Bar Chart", path: "/dashboard/bar-chart", pro: false },
    ],
  },
  {
    icon: <BoxIcon />,
    name: "UI Elements",
    subItems: [
      { name: "Alerts", path: "/dashboard/alerts", pro: false },
      { name: "Avatar", path: "/dashboard/avatars", pro: false },
      { name: "Badge", path: "/dashboard/badge", pro: false },
      { name: "Buttons", path: "/dashboard/buttons", pro: false },
      { name: "Images", path: "/dashboard/images", pro: false },
      { name: "Videos", path: "/dashboard/videos", pro: false },
    ],
  },
  {
    icon: <Plug />,
    name: "Authentication",
    subItems: [
      { name: "Sign In", path: "/dashboard/signin", pro: false },
      { name: "Sign Up", path: "/dashboard/signup", pro: false },
    ],
  },
];

const AppSidebar: React.FC = () => {
  // const { isMobileOpen} = useSidebar();

  // console.log(session);
  //  const pathname = usePathname()
  const {
    isExpanded,
    isMobileOpen,
    isHovered,
    setIsHovered,
    // toggleSidebar,
    toggleMobileSidebar,
  } = useSidebar();
  const pathname = usePathname();

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others"
  ) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group  ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={` ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200  ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <>
                <Link
                  href={nav.path}
                  // onClick={() => toggleMobileSidebar()}
                  className={` hidden md:flex menu-item group ${
                    isActive(nav.path)
                      ? "menu-item-active"
                      : "menu-item-inactive"
                  }`}
                >
                  <span
                    className={`${
                      isActive(nav.path)
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className={`menu-item-text`}>{nav.name}</span>
                  )}
                </Link>
                <Link
                  href={nav.path}
                  onClick={() => toggleMobileSidebar()}
                  className={`md:hidden menu-item group ${
                    isActive(nav.path)
                      ? "menu-item-active"
                      : "menu-item-inactive"
                  }`}
                >
                  <span
                    className={`${
                      isActive(nav.path)
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className={`menu-item-text`}>{nav.name}</span>
                  )}
                </Link>
              </>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => path === pathname;
  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={`fixed mt-18 flex flex-col lg:mt-0 top-0 px-4 left-0 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md dark:border-stone-800 text-stone-900 dark:text-white h-screen transition-all duration-300 ease-in-out z-50 border-r border-stone-200/80 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex  ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/dashboard" className="flex items-center justify-center">
          {isExpanded || isHovered || isMobileOpen ? (
            <div className="flex flex-row items-center justify-center py-1">
              <BrandLogo siteTitle="Future com" size="md" />
            </div>
          ) : (
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 font-black text-xl">
              F
            </div>
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-4 flex-1">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-3 text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center flex"
                    : "justify-start flex"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Management"
                ) : (
                  <div className="flex flex-row items-center">
                    <Ellipsis />
                  </div>
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
          </div>
        </nav>

        {(isExpanded || isHovered || isMobileOpen) && (
          <div className="mt-auto mb-6 p-4 rounded-2xl bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/20 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Store Online
              </span>
              <span className="text-[10px] uppercase font-bold text-orange-600 dark:text-orange-400">
                Future com
              </span>
            </div>
            <p className="text-stone-500 dark:text-stone-400 text-[11px] leading-snug">
              Powered by Futgensoft e-commerce engine.
            </p>
            <Link
              href="/dashboard/settings/general"
              className="inline-block w-full text-center py-2 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all cursor-pointer"
            >
              Site Settings
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
};

export default AppSidebar;
