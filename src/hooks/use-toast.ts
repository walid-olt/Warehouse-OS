"use client"

import { toast } from "sonner"

export { toast }

export function useToast() {
  return {
    toast,
    dismiss: toast.dismiss,
    promise: toast.promise,
    custom: toast.custom,
    loading: toast.loading,
    success: toast.success,
    error: toast.error,
    info: toast.info,
    warning: toast.warning,
  }
}
