"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRegisterMutation } from "@/features/user/api/user.api";
import { getErrorMessage, zodFieldErrors } from "@/lib/utils";

import { registerSchema } from "../schemas/auth.schema";

export function RegisterForm() {
  const router = useRouter();
  const [register, { isLoading }] = useRegisterMutation();

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");

  const handleChange =
    (field: keyof typeof values) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    const parsed = registerSchema.safeParse(values);

    if (!parsed.success) {
      setFieldErrors(zodFieldErrors(parsed.error));
      return;
    }

    setFieldErrors({});

    try {
      await register(parsed.data).unwrap();
      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight">
          Create your account
        </h1>
        <p className="text-sm text-foreground/60">
          Join Ilish Bazar and start ordering.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <Input
            id="name"
            autoComplete="name"
            value={values.name}
            onChange={handleChange("name")}
            placeholder="Your name"
          />
          {fieldErrors.name ? (
            <p className="text-xs text-red-600">{fieldErrors.name}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={handleChange("email")}
            placeholder="you@example.com"
          />
          {fieldErrors.email ? (
            <p className="text-xs text-red-600">{fieldErrors.email}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            value={values.password}
            onChange={handleChange("password")}
            placeholder="••••••••"
          />
          {fieldErrors.password ? (
            <p className="text-xs text-red-600">{fieldErrors.password}</p>
          ) : null}
        </div>

        {formError ? <p className="text-sm text-red-600">{formError}</p> : null}

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="text-center text-sm text-foreground/60">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-foreground">
          Sign in
        </Link>
      </p>
    </div>
  );
}
