import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeleteRegistration, useDownloadExcel, useRegistrations, useUpdateRegistrationStatus } from "@/hooks/use-registrations";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Clock,
  Download,
  GraduationCap,
  Loader2,
  LogOut,
  MapPin,
  Search,
  Shield,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function AdminDashboard() {
  const { data: users, isLoading } = useRegistrations();
  const { mutate: downloadExcel, isPending: isDownloading } = useDownloadExcel();
  const { mutate: updateStatus } = useUpdateRegistrationStatus();
  const { mutate: deleteRegistration } = useDeleteRegistration();
  const [search, setSearch] = useState("");
  const [, setLocation] = useLocation();

  // Get admin role from localStorage
  const adminRole = typeof window !== "undefined" ? localStorage.getItem("adminRole") : null;
  const adminUsername = typeof window !== "undefined" ? localStorage.getItem("adminUsername") : null;
  const isMainAdmin = adminRole === "main_admin";
  const isUniversityAdmin = adminRole === "university_admin";
  const canUpdateStatus = isMainAdmin || isUniversityAdmin;
  const isOrgAdmin = adminRole === "organization_admin";

  // Get role display name
  const getRoleDisplayName = (role: string | null) => {
    switch (role) {
      case "main_admin":
        return "Main Admin";
      case "university_admin":
        return "University Admin";
      case "organization_admin":
        return "Organization Admin";
      default:
        return "Admin";
    }
  };

  const filteredUsers = users?.filter(
    (user) =>
      user.fullName.toLowerCase().includes(search.toLowerCase()) ||
      user.district.toLowerCase().includes(search.toLowerCase()) ||
      user.qualification.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("adminRole");
    localStorage.removeItem("adminUsername");
    setLocation("/");
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    updateStatus({ id, status: newStatus });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this registration?")) {
      deleteRegistration(id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-3">
        <div className="w-14 h-14 bg-blue-700 rounded-xl flex items-center justify-center">
          <Loader2 className="w-7 h-7 animate-spin text-white" />
        </div>
        <p className="text-gray-500 text-sm font-medium">Loading dashboard data...</p>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Registrations",
      value: users?.length ?? 0,
      icon: <Users className="h-5 w-5" />,
      color: "bg-blue-100 text-blue-700",
      border: "border-l-blue-600",
    },
    {
      label: "Districts Covered",
      value: new Set(users?.map((u) => u.district)).size,
      icon: <MapPin className="h-5 w-5" />,
      color: "bg-indigo-100 text-indigo-700",
      border: "border-l-indigo-600",
    },
    {
      label: "Unique Qualifications",
      value: new Set(users?.map((u) => u.qualification)).size,
      icon: <GraduationCap className="h-5 w-5" />,
      color: "bg-green-100 text-green-700",
      border: "border-l-green-600",
    },
    {
      label: "Pending Review",
      value: users?.filter((u) => u.status === "pending").length ?? 0,
      icon: <Clock className="h-5 w-5" />,
      color: "bg-amber-100 text-amber-700",
      border: "border-l-amber-500",
    },
  ];

  return (
    <div className="w-full bg-gray-50 min-h-screen">

      {/* ── Top Admin Bar ── */}
      <div className="bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-300" />
            <span className="text-sm font-medium text-blue-200">Admin Portal</span>
            <ChevronRight className="w-3 h-3 text-blue-400" />
            <span className="text-sm font-semibold text-white">Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            {/* Admin Management Link - Only for Main Admin */}
            {isMainAdmin && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/admin/management")}
                className="text-blue-300 hover:text-white hover:bg-blue-800 text-sm"
              >
                <Shield className="w-4 h-4 mr-1.5" />
                Manage Admins
              </Button>
            )}
            {/* Role Badge */}
            <span className="text-xs bg-blue-800 px-2 py-1 rounded text-blue-200">
              {getRoleDisplayName(adminRole)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-blue-300 hover:text-white hover:bg-blue-800 text-sm"
            >
              <LogOut className="w-4 h-4 mr-1.5" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* ── Page Header ── */}
      <div className="bg-blue-800 pb-8 pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-blue-300 text-xs font-semibold uppercase tracking-widest mb-1">
                JNTU-GV — Careers Cell
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {isMainAdmin ? "Admin Dashboard" : `${getRoleDisplayName(adminRole)} Dashboard`}
              </h1>
              <p className="text-blue-300 text-sm mt-1">
                {isMainAdmin 
                  ? "Manage and monitor candidate registrations" 
                  : "View and download candidate registrations"}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => downloadExcel()}
                disabled={isDownloading}
                className="bg-amber-500 hover:bg-amber-400 text-white border-0 font-semibold h-10 px-5 rounded-lg self-start sm:self-auto"
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Export to Excel
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Cards ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`bg-white rounded-xl p-5 border-l-4 ${stat.border} shadow-sm`}
            >
              <div className={`w-9 h-9 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-xs font-medium text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Candidates Table ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        >
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Registered Candidates</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {filteredUsers?.length ?? 0} result{filteredUsers?.length !== 1 ? "s" : ""} shown
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, district or qualification..."
                className="pl-9 h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-700 hover:bg-blue-700">
                  <TableHead className="text-white font-semibold text-xs uppercase tracking-wider py-3 pl-6">
                    Candidate
                  </TableHead>
                  <TableHead className="text-white font-semibold text-xs uppercase tracking-wider py-3">
                    Qualification
                  </TableHead>
                  <TableHead className="text-white font-semibold text-xs uppercase tracking-wider py-3">
                    Age
                  </TableHead>
                  <TableHead className="text-white font-semibold text-xs uppercase tracking-wider py-3">
                    District
                  </TableHead>
                  <TableHead className="text-white font-semibold text-xs uppercase tracking-wider py-3">
                    Preferred City
                  </TableHead>
                  <TableHead className="text-white font-semibold text-xs uppercase tracking-wider py-3">
                    Applied On
                  </TableHead>
                  <TableHead className="text-white font-semibold text-xs uppercase tracking-wider py-3 text-right pr-6">
                    Status
                  </TableHead>
                  {isMainAdmin  && (
                    <TableHead className="text-white font-semibold text-xs uppercase tracking-wider py-3 text-right pr-6">
                      Actions
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {!filteredUsers?.length ? (
                  <TableRow>
                    <TableCell colSpan={isMainAdmin ? 8 : 7} className="text-center py-16 text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="w-8 h-8 text-gray-300" />
                        <p className="text-sm font-medium">No candidates found</p>
                        {search && (
                          <p className="text-xs">Try adjusting your search query</p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user, idx) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.02 }}
                      className="border-b border-gray-100 hover:bg-blue-50 transition-colors duration-150"
                    >
                      <TableCell className="py-3 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex items-center justify-center flex-shrink-0">
                            {user.fullName.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{user.fullName}</p>
                            <p className="text-xs text-gray-400">{user.gender ?? "—"}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-sm text-gray-700">{user.qualification}</TableCell>
                      <TableCell className="py-3 text-sm text-gray-700">{user.age}</TableCell>
                      <TableCell className="py-3 text-sm text-gray-700">{user.district}</TableCell>
                      <TableCell className="py-3 text-sm text-gray-700">{user.preferredLocation}</TableCell>
                      <TableCell className="py-3 text-sm text-gray-500">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                          : "N/A"}
                      </TableCell>
                      <TableCell className="py-3 text-right pr-6">
                        {canUpdateStatus ? (
                          <select
                            aria-label="Change registration status"
                            value={user.status}
                            onChange={(e) => handleStatusChange(user.id, e.target.value)}
                            className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer ${user.status === "pending"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-green-100 text-green-800"
                              }`}
                          >
                            <option value="pending">⏳ Pending</option>
                            <option value="approved">✓ Approved</option>
                            <option value="rejected">✗ Rejected</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${user.status === "pending"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-green-100 text-green-800"
                              }`}
                          >
                            {user.status === "pending" ? "⏳ Pending" : "✓ " + user.status}
                          </span>
                        )}
                      </TableCell>
                      {isMainAdmin && (
                        <TableCell className="py-3 text-right pr-6">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(user.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      )}
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Table Footer */}
          {(filteredUsers?.length ?? 0) > 0 && (
            <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Showing {filteredUsers?.length} of {users?.length} candidates
              </p>
              <p className="text-xs text-gray-400">
                Last updated: {new Date().toLocaleTimeString("en-IN")}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
