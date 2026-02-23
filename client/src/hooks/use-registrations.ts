import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertRegistration, type Registration } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// Admin: Login
export function useAdminLogin() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      if (!res.ok) {
        throw new Error('Invalid credentials');
      }
      return await res.json();
    },
    onError: (error) => {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Public: Create Registration
export function useCreateRegistration() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: InsertRegistration) => {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to register');
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({
        title: "Registration Successful!",
        description: "Your details have been submitted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Admin: List Registrations
export function useRegistrations() {
  return useQuery({
    queryKey: ['/api/users'],
    queryFn: async () => {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Failed to fetch registrations');
      return await res.json() as Registration[];
    },
  });
}

// Admin: Download Excel
export function useDownloadExcel() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/download');
      if (!res.ok) throw new Error('Download failed');
      
      // Handle binary download
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `registrations-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onError: () => {
      toast({
        title: "Download Failed",
        description: "Could not download the excel file.",
        variant: "destructive",
      });
    },
  });
}
