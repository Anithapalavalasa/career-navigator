import { useToast } from "@/hooks/use-toast";
import { type InsertRegistration, type Registration } from "@shared/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

// Admin: Forgot Password
export function useForgotPassword() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (email: string) => {
      const res = await fetch('/api/admin/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to process request');
      }
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Reset Link Sent",
        description: "If an account with that email exists, a password reset link has been sent.",
      });
    },
    onError: (error) => {
      toast({
        title: "Request Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Admin: Reset Password
export function useResetPassword() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ token, newPassword }: { token: string; newPassword: string }) => {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to reset password');
      }
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Password Reset Successful",
        description: "You can now log in with your new password.",
      });
    },
    onError: (error) => {
      toast({
        title: "Reset Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Verify Reset Token
export function useVerifyResetToken(token: string) {
  return useQuery({
    queryKey: ['verify-reset-token', token],
    queryFn: async () => {
      const res = await fetch(`/api/admin/verify-reset-token?token=${encodeURIComponent(token)}`);
      if (!res.ok) {
        throw new Error('Invalid or expired token');
      }
      return await res.json() as { valid: boolean; username?: string };
    },
    enabled: !!token, // Don't fetch without a token
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

// Admin: List Registrations (Protected)
export function useRegistrations() {
  return useQuery({
    queryKey: ['/api/users'],
    queryFn: async () => {
      const res = await fetch('/api/users', {
        headers: getAdminHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch registrations');
      return await res.json() as Registration[];
    },
  });
}

// Admin: Download Excel (Protected)
export function useDownloadExcel() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/download', {
        headers: getAdminHeaders(),
      });
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

// Admin: Update Registration Status (Main Admin Only)
export function useUpdateRegistrationStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await fetch(`/api/registrations/${id}/status`, {
        method: 'PATCH',
        headers: getAdminHeaders(),
        body: JSON.stringify({ status }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update status');
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({
        title: "Status Updated",
        description: "Registration status has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Admin: Delete Registration (Main Admin Only)
export function useDeleteRegistration() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/registrations/${id}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to delete registration');
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({
        title: "Registration Deleted",
        description: "The registration has been deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
