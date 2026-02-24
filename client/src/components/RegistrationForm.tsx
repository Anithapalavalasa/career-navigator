import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
import { insertRegistrationSchema, type InsertRegistration } from "@shared/schema";
import { differenceInYears, format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import {
  Award,
  CalendarIcon,
  CheckCircle2,
  GraduationCap,
  Loader2,
  Mail,
  MapPin,
  Send,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";

// ── Compact Radio Group
function RadioGroup({
  options,
  value,
  onChange,
  name,
}: {
  options: string[];
  value: string | boolean;
  onChange: (v: any) => void;
  name: string;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const isSelected =
          value === opt || (typeof value === "boolean" && String(value) === opt);
        return (
          <label
            key={opt}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md border cursor-pointer text-xs font-medium transition-all duration-150 ${isSelected
              ? "border-blue-600 bg-blue-50 text-blue-700"
              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
          >
            <input
              type="radio"
              name={name}
              className="sr-only"
              checked={!!isSelected}
              onChange={() => onChange(opt)}
            />
            <span
              className={`w-2.5 h-2.5 rounded-full border flex items-center justify-center flex-shrink-0 ${isSelected ? "border-blue-600 bg-blue-600" : "border-gray-400"
                }`}
            >
              {isSelected && <span className="w-1 h-1 bg-white rounded-full" />}
            </span>
            {opt === "true" ? "Yes" : opt === "false" ? "No" : opt}
          </label>
        );
      })}
    </div>
  );
}

// ── Compact Section Header
function SectionHeader({
  icon,
  title,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-1.5 pb-1.5 border-b border-gray-200 mb-3">
      <div
        className={`w-5 h-5 ${color} text-white rounded flex items-center justify-center flex-shrink-0`}
      >
        {icon}
      </div>
      <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">{title}</h3>
    </div>
  );
}

export function RegistrationForm() {
  const [, setLocation] = useLocation();
  const { mutate: register, isPending, isSuccess } = useCreateRegistration();
  const [calendarOpen, setCalendarOpen] = useState(false);

  // DOB constraints — dynamic so they update every new year automatically
  const currentYear = new Date().getFullYear();
  const minDOB = new Date(1998, 0, 1);           // Jan 1, 1998
  const maxDOB = new Date(currentYear - 5, 11, 31); // Dec 31 of (currentYear - 5)

  const form = useForm<InsertRegistration>({
    resolver: zodResolver(insertRegistrationSchema),
    defaultValues: {
      fullName: "",
      dob: "",
      age: 0,
      gender: "",
      email: "",
      phone: "",
      passedYear: "",
      status: "Pass",
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

  const onSubmit = (data: InsertRegistration) => {
    register(data, {
      onSuccess: () => {
        form.reset();
        setTimeout(() => setLocation("/"), 2500);
      },
      onError: (err: any) => {
        // Parse the server error response
        const body = err?.response?.data ?? err?.data ?? {};

        if (body.duplicate) {
          const field: "email" | "phone" | "both" = body.field;
          const msg = "Already registered with this";

          if (field === "email" || field === "both") {
            form.setError("email", {
              type: "server",
              message: `${msg} email address.`,
            });
          }
          if (field === "phone" || field === "both") {
            form.setError("phone", {
              type: "server",
              message: `${msg} phone number.`,
            });
          }

          // Scroll the first error into view
          const firstField = field === "phone" ? "phone" : "email";
          const el = document.querySelector(`[name="${firstField}"]`);
          el?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      },
    });
  };

  const districts = [
    "Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool",
    "Prakasam", "Srikakulam", "Sri Potti Sriramulu Nellore", "Visakhapatnam",
    "Vizianagaram", "West Godavari", "YSR Kadapa", "Parvathipuram Manyam",
    "Alluri Sitharama Raju", "Anakapalli", "Kakinada", "Konaseema", "Eluru",
    "NTR", "Bapatla", "Palnadu", "Nandyal", "Sri Sathya Sai", "Annamayya", "Tirupati",
  ];

  const qualifications = [
    "B.Tech", "Diploma", "ITI", "B.Sc", "B.Com", "BBM", "BBA",
    "MBA-Finance", "MBA-Marketing", "MCA", "M.Tech",
    "B-Pharmacy", "M-Pharmacy", "D-Pharmacy",
  ];

  const locations = [
    "Hyderabad", "Vizag", "Bengaluru", "Chennai", "Indore", "Sricity", "Pune", "Vijayawada"
  ];

  // ── Success State
  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center"
      >
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-green-600" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Registration Submitted!</h2>
        <p className="text-gray-500 text-sm mb-4">
          Thank you for registering. Our team will review your application and contact you shortly.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-left mb-4">
          <p className="text-green-800 text-xs font-semibold mb-1">What happens next?</p>
          <ul className="space-y-0.5">
            {[
              "Profile reviewed within 3–5 working days.",
              "Confirmation email will be sent.",
              "Placement opportunities shared as they arise.",
            ].map((s, i) => (
              <li key={i} className="text-green-700 text-xs flex items-start gap-1.5">
                <span>✓</span> {s}
              </li>
            ))}
          </ul>
        </div>
        <Button
          onClick={() => setLocation("/")}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white text-sm"
        >
          Return to Home
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* ── Card Header ── */}
      <div className="bg-blue-700 px-4 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5">
        <h2 className="text-sm font-bold text-white">Candidate Registration Form</h2>
        <span className="text-blue-200 text-xs">
          Fields marked <span className="text-amber-300 font-bold">*</span> are mandatory
        </span>
      </div>

      <div className="px-4 py-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            {/* ══ SECTION 1: Personal Information ══ */}
            <div>
              <SectionHeader icon={<User className="h-3 w-3" />} title="Personal Information" color="bg-blue-700" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel className="text-xs font-semibold text-gray-700">Full Name <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Ravi Kumar Sharma" className="h-8 text-xs border-gray-300 focus:border-blue-500" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-gray-700">Date of Birth <span className="text-red-500">*</span></FormLabel>
                      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <button
                              type="button"
                              className={`flex h-8 w-full items-center justify-between rounded-md border px-3 text-xs transition-colors
                                ${field.value
                                  ? "border-gray-300 text-gray-700"
                                  : "border-gray-300 text-gray-400"
                                }
                                bg-white hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            >
                              <span>
                                {field.value
                                  ? format(parseISO(field.value), "dd-MMM-yyyy")
                                  : "Select date of birth"}
                              </span>
                              <CalendarIcon className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                            </button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            fromYear={1998}
                            toYear={currentYear - 17}
                            defaultMonth={
                              field.value ? parseISO(field.value) : new Date(2000, 0, 1)
                            }
                            selected={field.value ? parseISO(field.value) : undefined}
                            onSelect={(date) => {
                              if (date) {
                                field.onChange(format(date, "yyyy-MM-dd"));
                                setCalendarOpen(false);
                              }
                            }}
                            disabled={(date) => date < minDOB || date > maxDOB}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-gray-700">Age</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          disabled
                          className="h-8 text-xs border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                          {...field}
                          value={field.value || 0}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel className="text-xs font-semibold text-gray-700">Gender <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <RadioGroup options={["Male", "Female", "Other"]} value={field.value} onChange={field.onChange} name="gender" />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="caste"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel className="text-xs font-semibold text-gray-700">Category <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <RadioGroup options={["OC", "BC", "SC", "ST"]} value={field.value} onChange={field.onChange} name="caste" />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* ══ SECTION 2: Contact Details ══ */}
            <div>
              <SectionHeader icon={<Mail className="h-3 w-3" />} title="Contact Details" color="bg-indigo-600" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-gray-700">Email Address <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="example@email.com" className="h-8 text-xs border-gray-300 focus:border-blue-500" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-gray-700">Phone Number <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="e.g. 9876543210" className="h-8 text-xs border-gray-300 focus:border-blue-500" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* ══ SECTION 3: Academic Details ══ */}
            <div>
              <SectionHeader icon={<GraduationCap className="h-3 w-3" />} title="Academic Details" color="bg-green-700" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <FormField
                  control={form.control}
                  name="qualification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-gray-700">Qualification <span className="text-red-500">*</span></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-8 text-xs border-gray-300 focus:border-blue-500">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {qualifications.map((q) => (
                            <SelectItem key={q} value={q} className="text-xs">{q}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="passedYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-gray-700">Year of Passing <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 2024" className="h-8 text-xs border-gray-300 focus:border-blue-500" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel className="text-xs font-semibold text-gray-700">Exam Status <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <RadioGroup options={["Pass", "Fail"]} value={field.value} onChange={field.onChange} name="status" />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* ══ SECTION 4: Location Preferences ══ */}
            <div>
              <SectionHeader icon={<MapPin className="h-3 w-3" />} title="Location Preferences" color="bg-amber-600" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-gray-700">Home District (Andhra Pradesh) <span className="text-red-500">*</span></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-8 text-xs border-gray-300 focus:border-blue-500">
                            <SelectValue placeholder="Select district" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-52">
                          {districts.map((d) => (
                            <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="preferredLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-gray-700">Preferred Job Location <span className="text-red-500">*</span></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-8 text-xs border-gray-300 focus:border-blue-500">
                            <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {locations.map((l) => (
                            <SelectItem key={l} value={l} className="text-xs">{l}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* ══ SECTION 5: Certifications ══ */}
            <div>
              <SectionHeader icon={<Award className="h-3 w-3" />} title="Certifications" color="bg-purple-700" />
              <FormField
                control={form.control}
                name="hasCertificates"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-gray-700">
                      Do you hold any certificates / Skill Course Certificates? <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        options={["true", "false"]}
                        value={String(field.value)}
                        onChange={(val) => field.onChange(val === "true")}
                        name="hasCertificates"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {hasCertificates && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mt-2"
                >
                  <FormField
                    control={form.control}
                    name="certificateDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-gray-700">
                          Certificate Details
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="List each certificate on a new line or separated by commas.&#10;e.g. AWS Cloud Practitioner (2023)&#10;     Python for Data Science – Coursera (2024)"
                            className="min-h-[96px] text-xs border-gray-300 focus-visible:ring-blue-500 focus-visible:border-blue-500 leading-relaxed"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <p className="text-xs text-gray-400 mt-1">
                          List certificate name, issuing body, and year for each qualification.
                        </p>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}
            </div>

            {/* ══ DECLARATION ══ */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
              <p className="text-xs text-blue-800 leading-relaxed">
                <strong>Declaration:</strong> I hereby declare that all information furnished above is true,
                complete, and correct to the best of my knowledge. False information may lead to cancellation of registration.
              </p>
            </div>

            {/* ══ SUBMIT ══ */}
            <Button
              type="submit"
              className="w-full h-9 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm rounded-lg transition-all duration-200"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-3.5 w-3.5" />
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
