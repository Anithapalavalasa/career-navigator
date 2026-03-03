import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Admin Management</CardTitle>
                <CardDescription>Manage admin accounts, edit details, and control access</CardDescription>
              </div>
              <Button onClick={() => setLocation("/admin/dashboard")} variant="outline">
                Back to Dashboard
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            {admins.length === 0 ? (
              <p className="text-center text-gray-500">No admins found</p>
            ) : (
              <div className="space-y-4">
                {admins.map((admin) => (
                  <div key={admin.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                    {editingId === admin.id ? (
                      // Edit Mode
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">Username</label>
                          <Input
                            value={editData.username || ""}
                            onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                            placeholder="Enter username"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Email</label>
                          <Input
                            type="email"
                            value={editData.email || ""}
                            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                            placeholder="Enter email"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSaveEdit(admin.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancel}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-semibold text-lg">{admin.username}</p>
                          <p className="text-sm text-gray-600">{admin.email}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Role: <span className="font-medium capitalize">{admin.role.replace("_", " ")}</span>
                          </p>
                          <p className="text-xs text-gray-500">
                            Created: {new Date(admin.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                            admin.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {admin.isActive ? "Active" : "Disabled"}
                          </span>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(admin)}
                          >
                            Edit
                          </Button>

                          <Button
                            size="sm"
                            onClick={() => handleToggleStatus(admin.id, admin.isActive)}
                            className={admin.isActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
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
      </div>
    </div>
  );
}
