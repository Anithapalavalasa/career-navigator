import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  dob: text("dob").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  passedYear: text("passed_year").notNull(),
  status: text("status").notNull(),
  qualification: text("qualification").notNull(),
  district: text("district").notNull(),
  caste: text("caste").notNull(),
  preferredLocation: text("preferred_location").notNull(),
  hasCertificates: boolean("has_certificates").notNull(),
  certificateDetails: text("certificate_details"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertRegistrationSchema = createInsertSchema(registrations).omit({ 
  id: true, 
  createdAt: true 
});

export type Registration = typeof registrations.$inferSelect;
export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
