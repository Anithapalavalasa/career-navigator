import { useRegistrations, useDownloadExcel } from "@/hooks/use-registrations";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Download, Search, User, LogOut, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const { data: users, isLoading } = useRegistrations();
  const { mutate: downloadExcel, isPending: isDownloading } = useDownloadExcel();
  const [search, setSearch] = useState("");
  const [, setLocation] = useLocation();

  const filteredUsers = users?.filter(user => 
    user.fullName.toLowerCase().includes(search.toLowerCase()) ||
    user.district.toLowerCase().includes(search.toLowerCase()) ||
    user.qualification.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = () => {
    // In a real app we'd clear tokens here
    setLocation('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-4 md:p-8 space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/50 dark:bg-black/20 backdrop-blur-xl p-6 rounded-2xl border border-white/20">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage and view candidate registrations</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => downloadExcel()} 
            disabled={isDownloading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isDownloading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            Export Excel
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{users?.length || 0}</div>
          </CardContent>
        </Card>
        <Card className="glass-card border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Districts Covered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {new Set(users?.map(u => u.district)).size}
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-yellow-600">
              {users?.filter(u => u.status === 'pending').length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card className="glass-card border-0 shadow-lg overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Recent Candidates</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search candidates..."
              className="pl-8 glass-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-white/10">
                  <TableHead className="w-[200px]">Name</TableHead>
                  <TableHead>Qualification</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Preferred Location</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-32 text-muted-foreground">
                      No candidates found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers?.map((user) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-white/5 border-b border-white/5 transition-colors"
                    >
                      <TableCell className="font-medium flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">
                          {user.fullName.substring(0, 2).toUpperCase()}
                        </div>
                        {user.fullName}
                      </TableCell>
                      <TableCell>{user.qualification}</TableCell>
                      <TableCell>{user.age}</TableCell>
                      <TableCell>{user.district}</TableCell>
                      <TableCell>{user.preferredLocation}</TableCell>
                      <TableCell>
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {user.status}
                        </span>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
