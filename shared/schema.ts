import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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
  district: text("district").notNull(), // 26 districts of AP
  caste: text("caste").notNull(), // OC, BC, SC, ST
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
