"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/useToast";
import { Lock, Mail, Gift, Key, ShieldAlert } from "lucide-react";
import Link from "next/link";

interface LoginInputs {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { user, login, isDemoMode } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/products");
      }
    }
  }, [user, router]);

  const onSubmitForm = async (data: LoginInputs) => {
    setLoading(true);
    setError("");

    try {
      const success = await login(data.email, data.password);
      if (success) {
        toast({
          title: "Logged in successfully",
          description: `Welcome back to Giftly!`,
          variant: "success",
        });
      } else {
        setError("Invalid email or password combination.");
        toast({
          title: "Login failed",
          description: "Verify email and password.",
          variant: "destructive",
        });
      }
    } catch (e: any) {
      console.error("Login submission failed:", e);
      setError(e.message || "Authentication failed.");
      toast({
        title: "Login failed",
        description: e.message || "An authentication error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const success = await login("admin@gift.com", "admin123");
      if (success) {
        toast({
          title: "Logged in as Admin",
          description: "Logged into Sandbox Admin Dashboard.",
          variant: "success",
        });
        router.push("/admin");
      }
    } catch (e) {
      setError("Quick login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-4 py-20 overflow-hidden font-normal">
      {/* Glows */}
      <div className="absolute top-[20%] left-[-10%] w-[350px] h-[350px] bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-violet-500/5 blur-[120px] pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md glass border border-border rounded-3xl p-8 bg-card/35 backdrop-blur-md relative z-10 space-y-6">
        
        {/* Head */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary p-3 rounded-2xl text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20">
            <Gift size={22} className="animate-pulse" />
          </div>
          <h1 className="text-xl font-black text-foreground tracking-tight pt-2">
            Welcome to Giftly Portal
          </h1>
          <p className="text-xs text-muted-foreground font-normal">
            Sign in as customer to review orders, or sign in as Admin to manage hampers.
          </p>
        </div>

        {/* Sandbox quick login credentials alert */}
        {isDemoMode && (
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 space-y-3">
            <div className="flex gap-2.5 items-start text-xs font-normal">
              <Key size={14} className="text-amber-300 shrink-0 mt-0.5" />
              <div className="space-y-1 leading-normal">
                <span className="font-bold text-foreground block">
                  Quick Sandbox Environment
                </span>
                <span className="text-muted-foreground mt-0.5 block leading-normal">
                  Click below to instantly bypass authentication and log into the SaaS Admin Dashboard:
                </span>
              </div>
            </div>
            <button
              onClick={handleQuickLogin}
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-xl text-xs font-bold shadow-md shadow-primary/15 transition cursor-pointer"
            >
              Demo Admin Quick Login
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl p-3 text-xs flex items-center gap-2">
            <ShieldAlert size={14} className="shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground pointer-events-none">
                <Mail size={14} />
              </span>
              <input
                type="email"
                placeholder="admin@gift.com"
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

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground pointer-events-none">
                <Lock size={14} />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full pl-9 pr-4 py-2.5 text-xs glass-input text-foreground rounded-xl ${errors.password ? "border-destructive focus:ring-destructive/15" : ""}`}
                {...register("password", { required: "Password is required" })}
              />
            </div>
            {errors.password && <span className="text-[9px] text-destructive font-bold">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center bg-foreground text-background hover:bg-foreground/95 py-2.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition cursor-pointer"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline font-bold transition duration-200">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
