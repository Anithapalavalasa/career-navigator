import { z } from "zod";
import { insertRegistrationSchema, registrations } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
  forbidden: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  admin: {
    login: {
      method: "POST" as const,
      path: "/api/admin/login" as const,
      input: z.object({ username: z.string(), password: z.string() }),
      responses: {
        200: z.object({
          success: z.boolean(),
          role: z.enum(["main_admin", "university_admin", "organization_admin"]),
          username: z.string(),
        }),
        401: errorSchemas.unauthorized,
      },
    },
    seed: {
      method: "POST" as const,
      path: "/api/admin/seed" as const,
      input: z.object({}).optional(),
      responses: {
        200: z.object({ success: z.boolean(), message: z.string() }),
      },
    },
    forgotPassword: {
      method: "POST" as const,
      path: "/api/admin/forgot-password" as const,
      input: z.object({ email: z.string().email("Please enter a valid email address") }),
      responses: {
        200: z.object({ success: z.boolean(), message: z.string() }),
        400: errorSchemas.validation,
      },
    },
    resetPassword: {
      method: "POST" as const,
      path: "/api/admin/reset-password" as const,
      input: z.object({
        token: z.string().min(1, "Reset token is required"),
        newPassword: z.string().min(8, "Password must be at least 8 characters"),
      }),
      responses: {
        200: z.object({ success: z.boolean(), message: z.string() }),
        400: errorSchemas.validation,
      },
    },
    verifyResetToken: {
      method: "GET" as const,
      path: "/api/admin/verify-reset-token" as const,
      input: z.object({ token: z.string() }),
      responses: {
        200: z.object({ valid: z.boolean(), username: z.string().optional() }),
        400: z.object({ valid: z.literal(false), message: z.string() }),
      },
    },
  },
  registrations: {
    create: {
      method: "POST" as const,
      path: "/api/register" as const,
      input: insertRegistrationSchema,
      responses: {
        201: z.custom<typeof registrations.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    list: {
      method: "GET" as const,
      path: "/api/users" as const,
      responses: {
        200: z.array(z.custom<typeof registrations.$inferSelect>()),
      },
    },
    download: {
      method: "GET" as const,
      path: "/api/download" as const,
      responses: {
        200: z.any(), // Binary Excel file
      },
    },
    updateStatus: {
      method: "PATCH" as const,
      path: "/api/registrations/:id/status" as const,
      input: z.object({ status: z.string() }),
      responses: {
        200: z.custom<typeof registrations.$inferSelect>(),
        403: errorSchemas.forbidden,
      },
    },
    delete: {
      method: "DELETE" as const,
      path: "/api/registrations/:id" as const,
      responses: {
        200: z.object({ success: z.boolean() }),
        403: errorSchemas.forbidden,
      },
    },
  },
  notifications: {
    list: {
      method: "GET" as const,
      path: "/api/notifications" as const,
      responses: {
        200: z.array(z.custom<import("./schema").Notification>()),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/notifications" as const,
      input: z.custom<import("./schema").InsertNotification>(),
      responses: {
        201: z.custom<import("./schema").Notification>(),
        400: errorSchemas.validation,
        403: errorSchemas.forbidden,
      },
    },
    update: {
      method: "PATCH" as const,
      path: "/api/notifications/:id" as const,
      input: z.custom<Partial<import("./schema").InsertNotification>>(),
      responses: {
        200: z.custom<import("./schema").Notification>(),
        400: errorSchemas.validation,
        403: errorSchemas.forbidden,
      },
    },
    delete: {
      method: "DELETE" as const,
      path: "/api/notifications/:id" as const,
      responses: {
        200: z.object({ success: z.boolean() }),
        403: errorSchemas.forbidden,
      },
    },
    upload: {
      method: "POST" as const,
      path: "/api/notifications/upload" as const,
      responses: {
        200: z.object({ url: z.string() }),
        400: errorSchemas.validation,
        403: errorSchemas.forbidden,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
