import { AdminNav } from "@/components/admin/AdminNav";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
    useCreateNotification,
    useDeleteNotification,
    useNotifications,
    useUpdateNotification,
    useUploadNotification,
} from "@/hooks/use-notifications";
import { zodResolver } from "@hookform/resolvers/zod";
import { InsertNotification, insertNotificationSchema, Notification } from "@shared/schema";
import { motion } from "framer-motion";
import {
    Bell,
    CheckCircle2,
    FileText,
    Link as LinkIcon,
    Loader2,
    Plus,
    Search,
    Trash2,
    XCircle
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";

export default function NotificationManagement() {
    const [, setLocation] = useLocation();
    const { data: notifications, isLoading } = useNotifications();
    const { mutate: createNotification, isPending: isCreating } = useCreateNotification();
    const { mutate: updateNotification } = useUpdateNotification();
    const { mutate: deleteNotification } = useDeleteNotification();
    const { mutate: uploadNotification, isPending: isUploading } = useUploadNotification();
    const [searchTerm, setSearchTerm] = useState("");
    const [pdfMode, setPdfMode] = useState<"upload" | "url">("upload");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Get admin role from localStorage
    const adminRole = typeof window !== "undefined" ? localStorage.getItem("adminRole") : null;

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

    const form = useForm<InsertNotification>({
        resolver: zodResolver(insertNotificationSchema),
        defaultValues: {
            title: "",
            description: "",
            type: "Job",
            pdfUrl: "",
            externalLink: "",
            lastDate: "",
            isActive: true,
        },
    });

    const onSubmit = (data: InsertNotification) => {
        if (editingId) {
            updateNotification({ id: editingId, data }, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    setEditingId(null);
                    form.reset();
                }
            });
        } else {
            createNotification(data, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    form.reset();
                }
            });
        }
    };

    const handleEdit = (notification: Notification) => {
        setEditingId(notification.id);
        form.reset({
            title: notification.title,
            description: notification.description,
            type: notification.type,
            pdfUrl: notification.pdfUrl || "",
            externalLink: notification.externalLink || "",
            lastDate: notification.lastDate || "",
            isActive: notification.isActive,
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm("Are you sure you want to delete this notification?")) {
            deleteNotification(id);
        }
    };

    const filteredNotifications = notifications?.filter(notif =>
        notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notif.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <>
                <AdminNav />
                <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-3">
                    <div className="w-14 h-14 bg-amber-600 rounded-xl flex items-center justify-center">
                        <Loader2 className="w-7 h-7 animate-spin text-white" />
                    </div>
                    <p className="text-gray-500 text-sm font-medium">Loading notifications...</p>
                </div>
            </>
        );
    }

    return (
        <div className="w-full bg-white min-h-screen pb-12">
            <AdminNav />

            {/* ── Page Header Section ── */}
            <div className="bg-slate-50 border-b border-slate-200 py-10 mb-8 shadow-inner">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-amber-600/10 text-amber-700 rounded-2xl flex items-center justify-center shadow-inner">
                            <Bell className="w-7 h-7" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2 uppercase">Notification Manager</h1>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Broadcasts</p>
                                </div>
                                <div className="h-4 w-px bg-slate-200" />
                                <p className="text-xs font-semibold text-slate-400">Manage site-wide announcements, job alerts, and vacancies.</p>
                            </div>
                        </div>
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) {
                            setEditingId(null);
                            form.reset();
                        }
                    }}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-black h-12 px-8 rounded-xl shadow-lg shadow-blue-900/10 uppercase tracking-widest text-[11px] border-0 transition-transform active:scale-95">
                                <Plus className="w-5 h-5 mr-3" /> Create Notification
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-2xl p-0 border-0 shadow-2xl">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <DialogHeader className="p-6 bg-gray-50 border-b border-gray-100">
                                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                                            {editingId ? "Edit Notification" : "Create Notification"}
                                        </DialogTitle>
                                        <DialogDescription>
                                            Fill in the details for the public announcement. All fields correctly formatted.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="p-6 space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-900 font-bold">Notification Title</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g., Recruitment of Lab Technician..." className="border-gray-200 focus:ring-amber-500 rounded-lg" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-900 font-bold">Short Description</FormLabel>
                                                    <FormControl>
                                                        <Textarea placeholder="Provide key details about the opportunity..." className="min-h-[100px] border-gray-200 focus:ring-amber-500 rounded-lg" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="type"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-gray-900 font-bold">Type</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="border-gray-200 focus:ring-amber-500 rounded-lg">
                                                                    <SelectValue placeholder="Select type" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent className="rounded-xl shadow-xl">
                                                                <SelectItem value="Job" className="hover:bg-amber-50 transition-colors">Job Posting</SelectItem>
                                                                <SelectItem value="Vacancy" className="hover:bg-amber-50 transition-colors">Vacancy</SelectItem>
                                                                <SelectItem value="Event" className="hover:bg-amber-50 transition-colors">Event</SelectItem>
                                                                <SelectItem value="News" className="hover:bg-amber-50 transition-colors">Latest News</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="lastDate"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-gray-900 font-bold">Deadline / Date</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="e.g., 12th March 2026" className="border-gray-200 focus:ring-amber-500 rounded-lg" {...field} value={field.value || ""} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="pdfUrl"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-gray-900 font-bold flex items-center justify-between">
                                                            <span>Document (PDF)</span>
                                                            <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setPdfMode("upload")}
                                                                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all ${pdfMode === 'upload' ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-400'}`}
                                                                >
                                                                    Upload
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setPdfMode("url")}
                                                                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all ${pdfMode === 'url' ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-400'}`}
                                                                >
                                                                    URL/Drive
                                                                </button>
                                                            </div>
                                                        </FormLabel>
                                                        <FormControl>
                                                            <div className="space-y-3">
                                                                {field.value && !isUploading ? (
                                                                    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-xl">
                                                                        <div className="flex items-center gap-2 overflow-hidden">
                                                                            <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                                                            <span className="text-sm font-medium text-blue-900 truncate">{field.value.startsWith('http') ? field.value : field.value.split('/').pop()}</span>
                                                                        </div>
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                            onClick={() => field.onChange("")}
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </Button>
                                                                    </div>
                                                                ) : pdfMode === 'upload' ? (
                                                                    <div className="relative group">
                                                                        <input
                                                                            type="file"
                                                                            accept=".pdf"
                                                                            className="hidden"
                                                                            id="pdf-upload"
                                                                            onChange={async (e) => {
                                                                                const file = e.target.files?.[0];
                                                                                if (file) {
                                                                                    uploadNotification(file, {
                                                                                        onSuccess: (res) => {
                                                                                            field.onChange(res.url);
                                                                                        }
                                                                                    });
                                                                                }
                                                                            }}
                                                                        />
                                                                        <label
                                                                            htmlFor="pdf-upload"
                                                                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-amber-400 transition-all"
                                                                        >
                                                                            {isUploading ? (
                                                                                <div className="flex flex-col items-center gap-2">
                                                                                    <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
                                                                                    <span className="text-xs font-bold text-gray-500">Uploading File...</span>
                                                                                </div>
                                                                            ) : (
                                                                                <div className="flex flex-col items-center gap-2">
                                                                                    <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                                                                        <Plus className="w-5 h-5 text-amber-600" />
                                                                                    </div>
                                                                                    <span className="text-xs font-bold text-gray-700">Click to upload PDF Document</span>
                                                                                    <span className="text-[10px] text-gray-400">PDF files only (Max 10MB)</span>
                                                                                </div>
                                                                            )}
                                                                        </label>
                                                                    </div>
                                                                ) : (
                                                                    <div className="relative">
                                                                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                                        <Input
                                                                            placeholder="Paste Drive link or PDF URL..."
                                                                            className="pl-9 border-gray-200 focus:ring-amber-500 rounded-lg"
                                                                            value={field.value || ""}
                                                                            onChange={(e) => field.onChange(e.target.value)}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="externalLink"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-gray-900 font-bold">Apply Link (Optional)</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                                <Input placeholder="https://..." className="pl-9 border-gray-200 focus:ring-amber-500 rounded-lg" {...field} value={field.value || ""} />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="isActive"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                    <div>
                                                        <FormLabel className="text-gray-900 font-bold">Public Status</FormLabel>
                                                        <p className="text-xs text-gray-500">Enable to show on home page.</p>
                                                    </div>
                                                    <FormControl>
                                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <DialogFooter className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                                        <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-lg h-11 px-6">Cancel</Button>
                                        <Button type="submit" disabled={isCreating} className="bg-blue-700 hover:bg-blue-800 text-white font-bold h-11 px-8 rounded-lg">
                                            {isCreating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : editingId ? "Update Notification" : "Publish Notification"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
                >
                    {/* Filter Bar */}
                    <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            All Notifications
                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                                {filteredNotifications?.length || 0}
                            </span>
                        </h2>
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search notifications..."
                                className="pl-9 h-10 border-gray-200 focus:ring-blue-500 rounded-lg"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50 hover:bg-gray-50">
                                    <TableHead className="py-4 pl-6 text-xs uppercase font-bold text-gray-500 tracking-wider">Title & Description</TableHead>
                                    <TableHead className="py-4 text-xs uppercase font-bold text-gray-500 tracking-wider">Type</TableHead>
                                    <TableHead className="py-4 text-xs uppercase font-bold text-gray-500 tracking-wider">Date/Deadline</TableHead>
                                    <TableHead className="py-4 text-xs uppercase font-bold text-gray-500 tracking-wider text-center">Status</TableHead>
                                    <TableHead className="py-4 text-xs uppercase font-bold text-gray-500 tracking-wider text-right pr-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {!filteredNotifications?.length ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                                    <Bell className="w-8 h-8 text-gray-300" />
                                                </div>
                                                <p className="text-gray-500 font-medium">No notifications found.</p>
                                                <Button variant="outline" onClick={() => setSearchTerm("")} size="sm">Clear search</Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredNotifications.map((notif, idx) => (
                                        <TableRow key={notif.id} className="hover:bg-blue-50/30 transition-colors">
                                            <TableCell className="py-4 pl-6 align-top max-w-md">
                                                <div className="flex flex-col gap-1">
                                                    <p className="font-bold text-gray-900 leading-tight">{notif.title}</p>
                                                    <p className="text-xs text-gray-500 line-clamp-2">{notif.description}</p>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        {notif.pdfUrl && <span className="flex items-center gap-1 text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-bold uppercase"><FileText className="w-3 h-3" /> PDF</span>}
                                                        {notif.externalLink && <span className="flex items-center gap-1 text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold uppercase"><LinkIcon className="w-3 h-3" /> Link</span>}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 align-top">
                                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${notif.type === 'Job' ? 'bg-amber-100 text-amber-700' :
                                                    notif.type === 'Event' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-purple-100 text-purple-700'
                                                    }`}>
                                                    {notif.type}
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-4 align-top">
                                                <p className="text-sm font-medium text-gray-700">{notif.lastDate || 'N/A'}</p>
                                            </TableCell>
                                            <TableCell className="py-4 align-top text-center">
                                                <button
                                                    onClick={() => updateNotification({ id: notif.id, data: { isActive: !notif.isActive } })}
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${notif.isActive ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-500 border border-gray-200'
                                                        }`}
                                                >
                                                    {notif.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                                    {notif.isActive ? 'Active' : 'Private'}
                                                </button>
                                            </TableCell>
                                            <TableCell className="py-4 align-top text-right pr-6">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => handleEdit(notif)} className="text-blue-600 hover:bg-blue-50 rounded-lg">Edit</Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(notif.id)} className="text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
