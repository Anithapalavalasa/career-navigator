import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { api, buildUrl } from "@shared/routes";
import { InsertNotification, Notification } from "@shared/schema";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useNotifications(activeOnly: boolean = false) {
    return useQuery<Notification[]>({
        queryKey: ["/api/notifications", { active: activeOnly }],
        queryFn: async () => {
            const url = activeOnly ? `${api.notifications.list.path}?active=true` : api.notifications.list.path;
            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to fetch notifications");
            return res.json();
        },
    });
}

export function useCreateNotification() {
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (notification: InsertNotification) => {
            const res = await fetch(api.notifications.create.path, {
                method: api.notifications.create.method,
                headers: {
                    "Content-Type": "application/json",
                    "x-admin-role": localStorage.getItem("adminRole") || "",
                    "x-admin-username": localStorage.getItem("adminUsername") || "",
                },
                body: JSON.stringify(notification),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Failed to create notification");
            }

            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
            toast({
                title: "Success",
                description: "Notification created successfully",
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        },
    });
}

export function useUpdateNotification() {
    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({ id, data }: { id: number; data: Partial<InsertNotification> }) => {
            const url = buildUrl(api.notifications.update.path, { id });
            const res = await fetch(url, {
                method: api.notifications.update.method,
                headers: {
                    "Content-Type": "application/json",
                    "x-admin-role": localStorage.getItem("adminRole") || "",
                    "x-admin-username": localStorage.getItem("adminUsername") || "",
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Failed to update notification");
            }

            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
            toast({
                title: "Success",
                description: "Notification updated successfully",
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        },
    });
}

export function useDeleteNotification() {
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (id: number) => {
            const url = buildUrl(api.notifications.delete.path, { id });
            const res = await fetch(url, {
                method: api.notifications.delete.method,
                headers: {
                    "x-admin-role": localStorage.getItem("adminRole") || "",
                    "x-admin-username": localStorage.getItem("adminUsername") || "",
                },
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Failed to delete notification");
            }

            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
            toast({
                title: "Success",
                description: "Notification deleted successfully",
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        },
    });
}

export function useUploadNotification() {
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch(api.notifications.upload.path, {
                method: api.notifications.upload.method,
                headers: {
                    "x-admin-role": localStorage.getItem("adminRole") || "",
                    "x-admin-username": localStorage.getItem("adminUsername") || "",
                },
                body: formData,
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Failed to upload file");
            }

            return res.json() as Promise<{ url: string }>;
        },
        onError: (error: Error) => {
            toast({
                title: "Upload Error",
                description: error.message,
                variant: "destructive",
            });
        },
    });
}
