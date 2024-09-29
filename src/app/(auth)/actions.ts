"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../../utils/supabase/server";
import { RegisterForm } from "./register/page";
import { z } from "zod";

const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, "Please enter email")
    .email("Please enter a valid email"),
  password: z.string().min(1, "Please enter password"),
});

type LoginForm = z.infer<typeof loginFormSchema>;

export async function login(payload: LoginForm) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs

  const { error, data } = await supabase.auth.signInWithPassword(payload);

  if (error) {
    return { error: error.message };
  }
  return { data: { message: "Sign in successful", session: data.session } };

  if (error) {
    redirect("/errorauth");
  }

  revalidatePath("/", "layout");
  redirect("/profile");
}

// /signup
export async function signup(payload: RegisterForm) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs

  const { error } = await supabase.auth.signUp(payload);

  if (error) {
    return { error: error.message };
  }
  return { data: "Sign up successful" };

  revalidatePath("/", "layout");
  redirect("/");
}
