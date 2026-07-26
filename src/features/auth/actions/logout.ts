'use server'
import { signOut } from "@/auth";

export async function logout(){
  signOut({redirectTo:"/login"})
  return
}
