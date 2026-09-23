"use client";

import { useDemo } from '@/components/demo/demo-context';
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Users,
  Search,
  Building,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  LogIn,
  KeyRound,
  ExternalLink,
} from "lucide-react";
import { DEMO_PERSONAS, DemoPersona, DEMO_PASSWORD } from "@/lib/constants/demo-personas";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface UserProfileWithScopes extends DemoPersona {
  primaryFacility: string;
  allowedLocations: string[];
  mfaEnabled: boolean;
  lastLogin: string;
}

const OPERATING_LOCATIONS = [
  "Coimbatore Head Office",
  "Tirupur Atelier",
  "Tirupur Garment Unit",
  "Coimbatore Garment Unit",
  "Kinathukidavu Composites",
  "Coimbatore Central Warehouse",
  "Field Sales Offices",
  "External Job-Worker Hub",
];

const ENRICHED_USERS: UserProfileWithScopes[] = DEMO_PERSONAS.map((p) => {
  let primaryFacility = "Coimbatore Head Office";
  let allowedLocations: string[] = [];

  switch (p.id) {
    case "management":
    case "admin":
      primaryFacility = "Coimbatore Head Office";
      allowedLocations = [...OPERATING_LOCATIONS];
      break;
    case "sales":
      primaryFacility = "Coimbatore Head Office";
      allowedLocations = ["Coimbatore Head Office", "Tirupur Atelier", "Field Sales Offices"];
      break;
    case "purchase":
      primaryFacility = "Coimbatore Head Office";
      allowedLocations = ["Coimbatore Head Office", "Coimbatore Central Warehouse", "Tirupur Garment Unit"];
      break;
    case "store":
      primaryFacility = "Coimbatore Central Warehouse";
      allowedLocations = ["Coimbatore Central Warehouse", "Tirupur Garment Unit", "Coimbatore Garment Unit"];
      break;
    case "production":
      primaryFacility = "Tirupur Garment Unit";
      allowedLocations = ["Tirupur Garment Unit", "Coimbatore Garment Unit", "Tirupur Atelier"];
      break;
    case "operator":
      primaryFacility = "Tirupur Garment Unit";
      allowedLocations = ["Tirupur Garment Unit"];
      break;
    case "quality":
      primaryFacility = "Tirupur Atelier";
      allowedLocations = ["Tirupur Atelier", "Tirupur Garment Unit", "Coimbatore Central Warehouse"];
      break;
    case "dispatch":
      primaryFacility = "Coimbatore Central Warehouse";
      allowedLocations = ["Coimbatore Central Warehouse", "Tirupur Garment Unit"];
      break;
    case "finance":
      primaryFacility = "Coimbatore Head Office";
      allowedLocations = ["Coimbatore Head Office", "Coimbatore Central Warehouse"];
      break;
    default:
      allowedLocations = [primaryFacility];
  }

  return {
    ...p,
    primaryFacility,
    allowedLocations,
    mfaEnabled: p.id === "management" || p.id === "admin",
    lastLogin: "Active Today",
  };
});

export default function UsersDirectoryPage() {
  const router = useRouter();
  const {setPersona}=useDemo();
  const [users] = useState<UserProfileWithScopes[]>(ENRICHED_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("directory");

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.roleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.primaryFacility.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSwitchPersona = (persona: DemoPersona) => {
    setPersona(persona.id);
    toast.success('Demo persona switched to '+persona.roleName);
    router.push('/dashboard');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-500" />
              User Directory & Location Scopes
            </h1>
            <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10 font-mono text-xs">
              Module 1 & 2: Access & Org
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Enterprise RBAC profiles and physical plant location security scopes for all 10 seed personas.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-muted/30 border rounded-lg p-2 text-xs text-muted-foreground">
          <KeyRound className="h-4 w-4 text-amber-500" />
          <span>Demo Credentials: <strong className="text-foreground font-mono">{DEMO_PASSWORD}</strong></span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <TabsList className="grid w-full sm:w-auto grid-cols-2">
            <TabsTrigger value="directory" className="text-xs">
              User Directory ({users.length})
            </TabsTrigger>
            <TabsTrigger value="matrix" className="text-xs">
              Location Access Matrix
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-72">
            <Search className="h-4 w-4 absolute left-3 top-2.5 text-muted-foreground" />
            <Input
              placeholder="Search user, role, plant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>
        </div>

        {/* Directory Cards Tab */}
        <TabsContent value="directory" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="border-border hover:border-slate-700 transition-all shadow-xs">
                <CardHeader className="p-4 pb-3 flex flex-row items-start justify-between gap-3 border-b bg-muted/20">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shadow-xs ${user.avatarColor}`}>
                      {user.name.split(" ").map((n) => n[0]).join("").substring(0, 2)}
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                        {user.name}
                        {user.mfaEnabled && (
                          <span title="MFA Protected">
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                          </span>
                        )}
                      </CardTitle>
                      <CardDescription className="text-xs font-mono text-muted-foreground">
                        {user.email}
                      </CardDescription>
                    </div>
                  </div>

                  <Badge variant={user.badgeVariant} className="text-[10px] uppercase font-mono">
                    {user.role}
                  </Badge>
                </CardHeader>

                <CardContent className="p-4 space-y-3">
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <span className="text-muted-foreground text-[10px] uppercase font-bold">Role:</span>
                      {user.roleName} • {user.department}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {user.description}
                    </p>
                  </div>

                  {/* Primary Facility */}
                  <div className="text-xs flex items-center gap-1.5 text-slate-300 bg-muted/30 p-2 rounded-md border">
                    <Building className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Primary Plant:</span>
                    <span className="font-medium text-foreground">{user.primaryFacility}</span>
                  </div>

                  {/* Location Scopes */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                      Permitted Location Scopes ({user.allowedLocations.length}):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {user.allowedLocations.map((loc) => (
                        <span
                          key={loc}
                          className="text-[10px] bg-slate-900 border border-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-medium flex items-center gap-1"
                        >
                          <MapPin className="h-2.5 w-2.5 text-emerald-500" />
                          {loc}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t flex items-center justify-between">
                    <span className="text-[11px] text-emerald-500 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Active in Tenant
                    </span>

                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs border-border hover:bg-muted flex items-center gap-1.5"
                      onClick={() => handleSwitchPersona(user)}
                    >
                      <LogIn className="h-3.5 w-3.5 text-blue-400" />
                      Act as this Persona
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Location Scope Matrix Tab */}
        <TabsContent value="matrix" className="mt-4">
          <Card className="border-border overflow-hidden">
            <CardHeader className="p-4 border-b bg-muted/20">
              <CardTitle className="text-sm font-semibold text-foreground">
                Enterprise Location Security Clearance Matrix
              </CardTitle>
              <CardDescription className="text-xs">
                Restricts inventory transactions, cutting orders, and inward receipts to authorised facilities.
              </CardDescription>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/40 text-[10px] uppercase font-bold text-muted-foreground border-b">
                  <tr>
                    <th className="p-3">User / Persona</th>
                    <th className="p-3">Role</th>
                    {OPERATING_LOCATIONS.map((loc) => (
                      <th key={loc} className="p-3 text-center min-w-28">
                        {loc.replace(" Garment Unit", "").replace(" Composites", "").replace(" Central Warehouse", " CW")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-3">
                        <div className="font-semibold text-foreground">{u.name}</div>
                        <div className="text-[10px] font-mono text-muted-foreground">{u.email}</div>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {u.role}
                        </Badge>
                      </td>
                      {OPERATING_LOCATIONS.map((loc) => {
                        const hasAccess = u.allowedLocations.includes(loc);
                        return (
                          <td key={loc} className="p-3 text-center">
                            {hasAccess ? (
                              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs">
                                ✓
                              </span>
                            ) : (
                              <span className="text-muted-foreground/30 text-xs">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
