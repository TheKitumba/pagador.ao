"use server";

import { z } from "zod";

/**
 * Pattern for Server Actions: validate the FormData with zod, call the API, and return a
 * serialisable state that works with `useActionState` and `<form action={...}>`.
 */

export type ActionState<TFields extends string = string> =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string; fieldErrors?: Partial<Record<TFields, string[]>> };

const exampleSchema = z.object({
  name: z.string().trim().min(1, "Indique o nome"),
});

type ExampleFields = keyof z.infer<typeof exampleSchema>;

export async function exampleAction(
  _previousState: ActionState<ExampleFields>,
  formData: FormData,
): Promise<ActionState<ExampleFields>> {
  const parsed = exampleSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: "Verifique os campos assinalados",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  // Call the API here (e.g. via a service in @api/services) and revalidate affected paths.

  return { status: "success", message: `Olá, ${parsed.data.name}` };
}
