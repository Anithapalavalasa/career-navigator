import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/* ================= DATABASE TABLE ================= */

export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),

  fullName: text("full_name").notNull(),
  dob: text("dob").notNull(),
  age: integer("age").notNull(),

  gender: text("gender").notNull(), // Male, Female, Other
  email: text("email").notNull(),
  phone: text("phone").notNull(),

  passedYear: text("passed_year").notNull(),
  status: text("status").notNull(), // Pass, Fail
  qualification: text("qualification").notNull(),

  district: text("district").notNull(), // AP districts
  caste: text("caste").notNull(), // OC, BC, SC, ST
  preferredLocation: text("preferred_location").notNull(),

  hasCertificates: boolean("has_certificates").notNull(),
  certificateDetails: text("certificate_details"),

  createdAt: timestamp("created_at").defaultNow(),
});

/* ================= INSERT VALIDATION ================= */

export const insertRegistrationSchema = createInsertSchema(
  registrations,
  {
    fullName: (schema) =>
      schema.min(3, "Full Name must be at least 3 characters"),

    dob: (schema) =>
      schema.min(1, "Date of Birth is required"),

    age: (schema) =>
      schema.min(15, "Minimum age must be 15"),

    gender: (schema) =>
      schema.min(1, "Gender is required"),

    email: (schema) =>
      schema.email("Enter a valid email address"),

    phone: () =>
      z
        .string()
        .regex(/^[6-9]\d{9}$/, "Enter valid 10-digit phone number"),

    passedYear: () =>
      z
        .string()
        .regex(/^\d{4}$/, "Enter valid 4-digit year"),

    status: (schema) =>
      schema.min(1, "Exam status required"),

    qualification: (schema) =>
      schema.min(1, "Qualification required"),

    district: (schema) =>
      schema.min(1, "District required"),

    caste: (schema) =>
      schema.min(1, "Category required"),

    preferredLocation: (schema) =>
      schema.min(1, "Preferred location required"),

    certificateDetails: () =>
      z.string().optional(),
  }
)
  .omit({
    id: true,
    createdAt: true,
  })
  .refine(
    (data) =>
      !data.hasCertificates ||
      (data.certificateDetails &&
        data.certificateDetails.trim().length > 5),
    {
      message: "Certificate details are required if you select Yes",
      path: ["certificateDetails"],
    }
  );

/* ================= TYPES ================= */

export type Registration = typeof registrations.$inferSelect;
export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;