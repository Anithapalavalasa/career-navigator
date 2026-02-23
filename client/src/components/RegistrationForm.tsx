import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { useCreateRegistration } from "@/hooks/use-registrations";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { differenceInYears, parseISO } from "date-fns";
import { motion } from "framer-motion";
import {
  Award,
  CheckCircle2,
  GraduationCap,
  Loader2,
  Mail,
  MapPin,
  Send,
  User,
} from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";

/* ================= VALIDATION SCHEMA ================= */

const registrationSchema = z
  .object({
    fullName: z.string().min(3, "Full Name is required"),
    dob: z.string().min(1, "Date of Birth is required"),
    age: z.number(),
    gender: z.string().min(1, "Gender is required"),
    email: z.string().email("Enter a valid email"),
    phone: z
      .string()
      .regex(/^[6-9]\d{9}$/, "Enter valid 10-digit phone number"),
    passedYear: z
      .string()
      .regex(/^\d{4}$/, "Enter valid 4-digit year"),
    status: z.string().min(1, "Exam status required"),
    qualification: z.string().min(1, "Qualification required"),
    district: z.string().min(1, "District required"),
    caste: z.string().min(1, "Category required"),
    preferredLocation: z.string().min(1, "Preferred location required"),
    hasCertificates: z.boolean(),
    certificateDetails: z.string().optional(),
  })
  .refine(
    (data) =>
      !data.hasCertificates ||
      (data.certificateDetails && data.certificateDetails.length > 5),
    {
      message: "Certificate details required",
      path: ["certificateDetails"],
    }
  );

type FormData = z.infer<typeof registrationSchema>;

/* ==================================================== */

export function RegistrationForm() {
  const [, setLocation] = useLocation();
  const { mutate: register, isPending, isSuccess } = useCreateRegistration();

  const form = useForm<FormData>({
    resolver: zodResolver(registrationSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      dob: "",
      age: 0,
      gender: "",
      email: "",
      phone: "",
      passedYear: "",
      status: "",
      qualification: "",
      district: "",
      caste: "",
      preferredLocation: "",
      hasCertificates: false,
      certificateDetails: "",
    },
  });

  const dob = form.watch("dob");
  const hasCertificates = form.watch("hasCertificates");

  useEffect(() => {
    if (dob) {
      const age = differenceInYears(new Date(), parseISO(dob));
      form.setValue("age", age >= 0 ? age : 0);
    }
  }, [dob, form]);

  const onSubmit = (data: FormData) => {
    register(data, {
      onSuccess: () => {
        form.reset();
        setTimeout(() => setLocation("/"), 2500);
      },
    });
  };

  /* ================= SUCCESS SCREEN ================= */

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl border p-8 text-center"
      >
        <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto mb-4" />
        <h2 className="text-lg font-bold mb-2">
          Registration Submitted Successfully!
        </h2>
        <p className="text-sm text-gray-500">
          Our team will contact you soon.
        </p>
      </motion.div>
    );
  }

  /* ================= FORM UI ================= */

  return (
    <div className="bg-white rounded-xl border shadow-sm">
      <div className="bg-blue-700 px-4 py-2 text-white text-sm font-bold">
        Candidate Registration Form
      </div>

      <div className="p-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >

            {/* Full Name */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone *</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* DOB */}
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DOB *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gender */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Male / Female / Other" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Qualification */}
            <FormField
              control={form.control}
              name="qualification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qualification *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* District */}
            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>District *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preferred Location */}
            <FormField
              control={form.control}
              name="preferredLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Location *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Certificates */}
            <FormField
              control={form.control}
              name="hasCertificates"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Do you have certificates? *</FormLabel>
                  <FormControl>
                    <Input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) =>
                        field.onChange(e.target.checked)
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {hasCertificates && (
              <FormField
                control={form.control}
                name="certificateDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certificate Details *</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-blue-700 text-white"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Registration
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}