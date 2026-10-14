import { toast } from "sonner";

import { ApiError } from "@api/lib/api-error";

export const toastService = {
  success: (message: string, description?: string) => toast.success(message, { description }),

  info: (message: string, description?: string) => toast.info(message, { description }),

  error: (message: string, description?: string) => toast.error(message, { description }),

  apiError: (error: unknown) => {
    const apiError = ApiError.from(error);
    return toast.error(apiError.message);
  },
};
