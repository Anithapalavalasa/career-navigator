import { AdminNav } from "@/components/admin/AdminNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Calendar, Loader2, Mail, Shield, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

interface Admin {
  id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

// Helper to get admin headers
function getAdminHeaders(): HeadersInit {
  const role = localStorage.getItem("adminRole") || "";
  const username = localStorage.getItem("adminUsername") || "";
  return {
    "Content-Type": "application/json",
    "x-admin-role": role,
    "x-admin-username": username,
  };
}

export default function AdminManagementPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Admin>>({});
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check authorization
    const adminRole = localStorage.getItem("adminRole");
    if (adminRole !== "main_admin") {
      toast({
        title: "Access Denied",
        description: "Only main admin can access this page",
        variant: "destructive",
      });
      setLocation("/admin/dashboard");
      return;
    }
    setIsAuthorized(true);
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admins", {
        headers: getAdminHeaders(),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch admins");
      }
      const data = await response.json();
      setAdmins(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load admins",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (admin: Admin) => {
    setEditingId(admin.id);
    setEditData({ username: admin.username, email: admin.email });
  };

  const handleSaveEdit = async (id: string) => {
    if (!editData.username || !editData.email) {
      toast({
        title: "Error",
        description: "Username and email are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/admins/${id}`, {
        method: "PUT",
        headers: getAdminHeaders(),
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update admin");
      }

      toast({
        title: "Success",
        description: "Admin details updated successfully",
      });

      setEditingId(null);
      setEditData({});
      fetchAdmins();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update admin",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admins/${id}/status`, {
        method: "PATCH",
        headers: getAdminHeaders(),
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update admin status");
      }

      toast({
        title: "Success",
        description: `Admin ${!currentStatus ? "enabled" : "disabled"} successfully`,
      });

      fetchAdmins();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  // Show loading while checking auth
  if (!isAuthorized && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-2xl">
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full bg-white min-h-screen pb-12">
      <AdminNav />

      {/* ── Page Header Section ── */}
      <div className="bg-slate-50 border-b border-slate-200 py-10 mb-8 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-indigo-600/10 text-indigo-700 rounded-2xl flex items-center justify-center shadow-inner">
              <Shield className="w-7 h-7" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2 uppercase">Account Management</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">System Governance</p>
                </div>
                <div className="h-4 w-px bg-slate-200" />
                <p className="text-xs font-semibold text-slate-400">Manage administrative accounts, control access levels, and monitor system users.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="shadow-sm border-gray-200 overflow-hidden rounded-2xl">
            <CardHeader className="bg-white border-b border-gray-100 py-6">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg font-bold text-gray-900">System Administrators</CardTitle>
                  <CardDescription className="text-xs font-medium text-gray-500">
                    Showing {admins.length} active administrative accounts
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {admins.length === 0 && !isLoading ? (
                <div className="py-20 text-center flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                    <Shield className="w-8 h-8 text-gray-200" />
                  </div>
                  <p className="text-gray-500 font-medium">No administrative accounts found</p>
                </div>
              ) : isLoading ? (
                <div className="py-20 text-center flex flex-col items-center gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                  <p className="text-gray-500 font-medium font-bold">Fetching admin data...</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {admins.map((admin) => (
                    <div key={admin.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                      {editingId === admin.id ? (
                        // Edit Mode
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-indigo-50/30 p-4 rounded-xl border border-indigo-100">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Username</label>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                  value={editData.username || ""}
                                  onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                                  placeholder="Enter username"
                                  className="pl-9 h-11 rounded-lg border-gray-200 focus:ring-indigo-500"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                  type="email"
                                  value={editData.email || ""}
                                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                  placeholder="Enter email"
                                  className="pl-9 h-11 rounded-lg border-gray-200 focus:ring-indigo-500"
                                />
                              </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                              <Button
                                size="sm"
                                onClick={() => handleSaveEdit(admin.id)}
                                className="bg-indigo-600 hover:bg-indigo-700 h-10 px-6 rounded-lg font-bold"
                              >
                                Save Changes
                              </Button>
                              <Button size="sm" variant="ghost" onClick={handleCancel} className="h-10 px-6 rounded-lg">
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                          <div className="space-y-4 flex-1">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <User className="w-6 h-6 text-gray-400" />
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{admin.username}</h3>
                                <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                                  <Mail className="w-3.5 h-3.5" /> {admin.email}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 pt-1">
                              <div className="flex items-center gap-1.5 text-xs font-bold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md uppercase tracking-wider">
                                <Shield className="w-3 h-3" /> {admin.role.replace("_", " ")}
                              </div>
                              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                                <Calendar className="w-3.5 h-3.5" />
                                Joined {new Date(admin.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 self-end sm:self-center">
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border shadow-sm ${admin.isActive
                              ? "bg-green-50 text-green-700 border-green-100"
                              : "bg-red-50 text-red-700 border-red-100"
                              }`}>
                              {admin.isActive ? "Active Account" : "Disabled"}
                            </span>

                            <div className="h-8 w-px bg-gray-100 mx-1 hidden sm:block" />

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(admin)}
                              className="text-indigo-600 hover:bg-indigo-50 font-bold h-9 rounded-lg"
                            >
                              Edit Details
                            </Button>

                            <Button
                              size="sm"
                              onClick={() => handleToggleStatus(admin.id, admin.isActive)}
                              variant={admin.isActive ? "destructive" : "default"}
                              className={`font-bold h-9 rounded-lg shadow-sm ${admin.isActive ? '' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                            >
                              {admin.isActive ? "Disable" : "Enable"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
