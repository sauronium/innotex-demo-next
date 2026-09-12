"use client";

import React, { useState, useEffect } from "react";
import { DEMO_PERSONAS, DemoPersona } from "@/lib/constants/demo-personas";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Building2,
  MapPin,
  Bell,
  Network,
  LogOut,
  ChevronDown,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function Topbar() {
  const router = useRouter();
  const [activePersona, setActivePersona] = useState<DemoPersona>(DEMO_PERSONAS[0]); // Management default
  const [activeUnit, setActiveUnit] = useState("Sportswear");
  const [activeLocation, setActiveLocation] = useState("Tirupur Garment Unit");
  const [attentionCount] = useState(3);

  useEffect(() => {
    const savedRole = localStorage.getItem("innotex_active_persona");
    if (savedRole) {
      const found = DEMO_PERSONAS.find((p) => p.id === savedRole);
      if (found) setActivePersona(found);
    }
  }, []);

  const switchPersona = async (persona: DemoPersona) => {
    setActivePersona(persona);
    localStorage.setItem("innotex_active_persona", persona.id);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: persona.email,
        password: process.env.NEXT_PUBLIC_DEMO_SEED_PASSWORD || "Demo@12345",
      });

      if (error) {
        console.warn("Persona auth note:", error.message);
      } else {
        toast.success(`Switched role to ${persona.roleName} (${persona.name})`);
      }
    } catch {
      toast.success(`Active persona: ${persona.roleName}`);
    }
  };

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    localStorage.removeItem("innotex_active_persona");
    toast.info("Signed out of demo session");
    router.push("/login");
  };

  const businessUnits = [
    "Sportswear",
    "Workwear & Uniforms",
    "Protective Clothing",
    "Technical Textiles",
  ];

  const operatingLocations = [
    "Coimbatore Head Office",
    "Tirupur Atelier",
    "Tirupur Garment Unit",
    "Coimbatore Garment Unit",
    "Kinathukidavu Composites Centre",
    "Coimbatore Central Warehouse",
  ];

  return (
    <header className="h-14 border-b border-border bg-card px-4 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Scope Selectors: Unit & Location */}
      <div className="flex items-center gap-2 md:gap-4 overflow-x-auto text-xs">
        {/* Business Unit Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 font-medium border-dashed text-xs text-foreground"
            >
              <Building2 className="h-3.5 w-3.5 text-blue-600" />
              <span className="hidden sm:inline text-muted-foreground">Unit:</span>
              <span className="font-semibold text-foreground truncate max-w-[120px]">
                {activeUnit}
              </span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 text-xs">
            <DropdownMenuLabel>Business Units</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {businessUnits.map((unit) => (
              <DropdownMenuItem
                key={unit}
                onClick={() => {
                  setActiveUnit(unit);
                  toast.info(`Switched context to ${unit}`);
                }}
                className={activeUnit === unit ? "bg-accent font-semibold" : ""}
              >
                {unit}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Operating Location Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 font-medium border-dashed text-xs text-foreground"
            >
              <MapPin className="h-3.5 w-3.5 text-emerald-600" />
              <span className="hidden sm:inline text-muted-foreground">Location:</span>
              <span className="font-semibold text-foreground truncate max-w-[140px]">
                {activeLocation}
              </span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64 text-xs">
            <DropdownMenuLabel>Operating Locations</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {operatingLocations.map((loc) => (
              <DropdownMenuItem
                key={loc}
                onClick={() => {
                  setActiveLocation(loc);
                  toast.info(`Location scope set to ${loc}`);
                }}
                className={activeLocation === loc ? "bg-accent font-semibold" : ""}
              >
                {loc}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Golden Path shortcut pill */}
        <Link href="/modules?workflow=golden-path" className="hidden lg:flex items-center">
          <Badge variant="golden" className="gap-1 cursor-pointer hover:bg-amber-100 transition-colors">
            <Network className="h-3 w-3 text-amber-800" />
            Golden Path: Enquiry → Cash
          </Badge>
        </Link>
      </div>

      {/* Right Controls: Attention Queue, Role Switcher, Profile */}
      <div className="flex items-center gap-2.5">
        {/* Interactive Module Map Quick Button */}
        <Link href="/modules">
          <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <Network className="h-3.5 w-3.5 text-blue-600" />
            <span className="hidden md:inline">Module Map</span>
          </Button>
        </Link>

        {/* Attention Queue Indicator */}
        <Link href="/dashboard#attention-queue">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 relative text-muted-foreground hover:text-foreground"
            title="Attention Queue: 3 urgent items"
          >
            <Bell className="h-4 w-4" />
            {attentionCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-background animate-pulse" />
            )}
          </Button>
        </Link>

        {/* Persona Role Switcher Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-2 border-slate-300 dark:border-slate-700 bg-background text-xs"
            >
              <div
                className={`h-5 w-5 rounded-full flex items-center justify-center font-bold text-[10px] ${activePersona.avatarColor}`}
              >
                {activePersona.name[0]}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-none">
                <span className="font-semibold text-foreground truncate max-w-[110px]">
                  {activePersona.name}
                </span>
                <span className="text-[10px] text-muted-foreground">{activePersona.roleName}</span>
              </div>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 text-xs">
            <DropdownMenuLabel className="flex flex-col">
              <span className="text-[11px] font-bold uppercase text-muted-foreground">
                Active Demo Persona
              </span>
              <span className="font-semibold text-sm text-foreground">{activePersona.name}</span>
              <span className="text-xs text-blue-600 font-medium">{activePersona.roleName}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="p-1 text-[11px] text-muted-foreground">
              Switch role to test maker-checker approvals and segregation of duties:
            </div>
            <div className="max-h-64 overflow-y-auto space-y-0.5 p-1">
              {DEMO_PERSONAS.map((p) => (
                <DropdownMenuItem
                  key={p.id}
                  onClick={() => switchPersona(p)}
                  className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                    activePersona.id === p.id ? "bg-accent font-semibold" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-[10px] ${p.avatarColor}`}
                    >
                      {p.name[0]}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{p.name}</div>
                      <div className="text-[10px] text-muted-foreground">{p.roleName}</div>
                    </div>
                  </div>
                  {activePersona.id === p.id && <UserCheck className="h-4 w-4 text-blue-600" />}
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
              <LogOut className="h-3.5 w-3.5 mr-2" />
              Sign Out to Login Page
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
