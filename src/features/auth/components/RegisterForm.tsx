"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import registerAction from "@/features/auth/actions/register";
import { registerUserSchema } from "../schemas/userSchema";
import type { RegisterUserDto } from "../types";

export default function RegisterForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    formState: { errors },
    setError,
    handleSubmit,
  } = useForm<RegisterUserDto>({
    reValidateMode: "onChange",
    resolver: zodResolver(registerUserSchema),
  });

  const submitHandler = async (credentials: RegisterUserDto) => {
    setIsSubmitting(true);
    try {
      const result = await registerAction(credentials);
      if (!result.success) {
        if (result.errors) {
          for (const [field, message] of Object.entries(result.errors)) {
            setError(field as keyof RegisterUserDto, { message });
          }
        } else {
          setError("root", { message: result.message });
        }
      } else {
       // router.push("/login");
	alert("register success")
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="flex flex-col gap-4"
    >
      {errors.root && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errors.root.message}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="name"
          className="text-xs font-medium text-muted-foreground"
        >
          Full name
        </label>
        <Input
          id="name"
          placeholder="Jane Doe"
          {...register("name")}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="text-xs font-medium text-muted-foreground"
        >
          Work email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="jane@warehouse.co"
          {...register("email")}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5 ">
        <label
          htmlFor="password"
          className="text-xs font-medium text-muted-foreground"
        >
          Password
        </label>
        <Input
          className={"py-2"}
          id="password"
          type="password"
          placeholder="••••••••"
          {...register("password")}
          aria-invalid={!!errors.password}
        />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="passwordConfirmation"
          className="text-xs font-medium text-muted-foreground"
        >
          Confirm password
        </label>
        <Input
          id="passwordConfirmation"
          type="password"
          placeholder="••••••••"
          {...register("passwordConfirmation")}
          aria-invalid={!!errors.passwordConfirmation}
        />
        {errors.passwordConfirmation && (
          <p className="text-xs text-destructive">
            {errors.passwordConfirmation.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 h-11 w-full bg-accent text-accent-foreground font-semibold hover:bg-accent/90 shadow-[0_0_30px_rgba(37,211,102,0.2)]"
      >
        {isSubmitting ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
}
