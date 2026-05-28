"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/useToast";
import { Lock, Mail, Gift, User, ShieldAlert } from "lucide-react";
import Link from "next/link";

interface RegisterInputs {
  email: string;
  displayName: string;
}

export default function SignupPage() {
  const router = useRouter();
  const { user, register: registerUser } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInputs>({
    defaultValues: {
      email: "",
      displayName: "",
    },
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/products");
    }
  }, [user, router]);

  const onSubmitForm = async (data: RegisterInputs) => {
    setLoading(true);
    setError("");

    try {
      const success = await registerUser(data.email, data.displayName);
      if (success) {
        toast({
          title: "Account created successfully",
          description: `Welcome to Giftly, ${data.displayName}!`,
          variant: "success",
        });
        router.push("/products");
      } else {
        setError("Failed to create account. Verify details.");
        toast({
          title: "Registration failed",
          description: "Verify email and name.",
          variant: "destructive",
        });
      }
    } catch (e: any) {
      console.error("Signup submission failed:", e);
      setError(e.message || "Registration failed.");
      toast({
        title: "Registration failed",
        description: e.message || "An error occurred during account creation.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-4 py-20 overflow-hidden font-normal">
      {/* Glows */}
      <div className="absolute top-[20%] left-[-10%] w-[350px] h-[350px] bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-violet-500/5 blur-[120px] pointer-events-none" />

      {/* Signup Card */}
      <div className="w-full max-w-md glass border border-border rounded-3xl p-8 bg-card/35 backdrop-blur-md relative z-10 space-y-6">
        
        {/* Head */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary p-3 rounded-2xl text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20">
            <Gift size={22} className="animate-pulse" />
          </div>
          <h1 className="text-xl font-black text-foreground tracking-tight pt-2">
            Create Your Account
          </h1>
          <p className="text-xs text-muted-foreground font-normal">
            Join Giftly to customize luxury hampers and track bespoke orders live.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl p-3 text-xs flex items-center gap-2">
            <ShieldAlert size={14} className="shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground pointer-events-none">
                <User size={14} />
              </span>
              <input
                type="text"
                placeholder="Jane Doe"
                className={`w-full pl-9 pr-4 py-2.5 text-xs glass-input text-foreground rounded-xl ${errors.displayName ? "border-destructive focus:ring-destructive/15" : ""}`}
                {...register("displayName", { 
                  required: "Full name is required",
                  minLength: { value: 2, message: "Name must be at least 2 characters" }
                })}
              />
            </div>
            {errors.displayName && <span className="text-[9px] text-destructive font-bold">{errors.displayName.message}</span>}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground pointer-events-none">
                <Mail size={14} />
              </span>
              <input
                type="email"
                placeholder="jane.doe@example.com"
                className={`w-full pl-9 pr-4 py-2.5 text-xs glass-input text-foreground rounded-xl ${errors.email ? "border-destructive focus:ring-destructive/15" : ""}`}
                {...register("email", { 
                  required: "Email is required", 
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email format"
                  }
                })}
              />
            </div>
            {errors.email && <span className="text-[9px] text-destructive font-bold">{errors.email.message}</span>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center bg-foreground text-background hover:bg-foreground/95 py-2.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition cursor-pointer"
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-bold transition duration-200">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
