import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertRegistrationSchema, type InsertRegistration } from "@shared/schema";
import { useCreateRegistration } from "@/hooks/use-registrations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { differenceInYears, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

export function RegistrationForm() {
  const [, setLocation] = useLocation();
  const { mutate: register, isPending, isSuccess } = useCreateRegistration();

  const form = useForm<InsertRegistration>({
    resolver: zodResolver(insertRegistrationSchema),
    defaultValues: {
      fullName: "",
      dob: "",
      age: 0,
      gender: "",
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

  // Auto-calculate age
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
        setTimeout(() => setLocation('/'), 2000);
      }
    });
  };

  const districts = [
    "Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", 
    "Prakasam", "Srikakulam", "Sri Potti Sriramulu Nellore", "Visakhapatnam", 
    "Vizianagaram", "West Godavari", "YSR Kadapa", "Parvathipuram Manyam", 
    "Alluri Sitharama Raju", "Anakapalli", "Kakinada", "Konaseema", "Eluru", 
    "NTR", "Bapatla", "Palnadu", "Nandyal", "Sri Sathya Sai", "Annamayya", "Tirupati"
  ];

  const qualifications = [
    "B.Tech", "Diploma", "ITI", "B.Sc", "B.Com", "BBM", "BBA", 
    "MBA-Finance", "MBA-Marketing", "MCA", "M.Tech", 
    "B-Pharmacy", "M-Pharmacy", "D-Pharmacy"
  ];

  const locations = [
    "Hyderabad", "Vizag", "Bengaluru", "Chennai", "Indore", "Sricity", "Pune"
  ];

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-2xl p-12 text-center max-w-md mx-auto"
      >
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-4">Registration Complete!</h2>
        <p className="text-muted-foreground text-lg mb-8">
          Thank you for registering. We will review your application and get back to you shortly.
        </p>
        <Button onClick={() => setLocation('/')} className="w-full">
          Return Home
        </Button>
      </motion.div>
    );
  }

  return (
    <Card className="glass-card border-0 shadow-2xl">
      <CardHeader className="space-y-2 pb-8">
        <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Candidate Registration
        </CardTitle>
        <CardDescription className="text-lg">
          Fill in your details accurately. Fields marked with * are mandatory.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Info */}
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" className="glass-input" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth *</FormLabel>
                      <FormControl>
                        <Input type="date" className="glass-input" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" disabled className="glass-input bg-muted/50" {...field} value={field.value || 0} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Gender *</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-4">
                        {["Male", "Female", "Other"].map((option) => (
                          <label key={option} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              className="w-4 h-4 text-primary"
                              checked={field.value === option}
                              onChange={() => field.onChange(option)}
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Status *</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-4">
                        {["Pass", "Fail"].map((option) => (
                          <label key={option} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              className="w-4 h-4 text-primary"
                              checked={field.value === option}
                              onChange={() => field.onChange(option)}
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="caste"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Caste *</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-4">
                        {["OC", "BC", "SC", "ST"].map((option) => (
                          <label key={option} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              className="w-4 h-4 text-primary"
                              checked={field.value === option}
                              onChange={() => field.onChange(option)}
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="qualification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Highest Qualification *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="glass-input">
                          <SelectValue placeholder="Select qualification" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {qualifications.map(q => (
                          <SelectItem key={q} value={q}>{q}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passedYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year of Passing *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 2024" className="glass-input" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>District (Andhra Pradesh) *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="glass-input">
                          <SelectValue placeholder="Select district" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {districts.map(d => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferredLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Job Location *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="glass-input">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {locations.map(l => (
                          <SelectItem key={l} value={l}>{l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="hasCertificates"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Any Certificates? *</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          className="w-4 h-4 text-primary"
                          checked={field.value === true}
                          onChange={() => field.onChange(true)}
                        />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          className="w-4 h-4 text-primary"
                          checked={field.value === false}
                          onChange={() => field.onChange(false)}
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {hasCertificates && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <FormField
                  control={form.control}
                  name="certificateDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Certificate Details (Max 250 words)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your certifications..."
                          className="glass-input min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
      </CardContent>
    </Card>
  );
}
