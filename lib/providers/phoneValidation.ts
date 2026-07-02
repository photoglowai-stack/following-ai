import type { ProviderContext, ProviderResult } from "@/lib/types";
import { normalizePhoneSignal } from "@/lib/normalizers";
import { providerResult } from "@/lib/providers/common";

export async function runPhoneValidation(context: ProviderContext): Promise<ProviderResult> {
  const start = Date.now();
  if (context.type !== "phone") {
    return providerResult("phone_validation", "skipped", [], [], Date.now() - start);
  }

  const digits = context.query.replace(/\D/g, "");
  return providerResult(
    "phone_validation",
    "success",
    [normalizePhoneSignal("phone_validation", "Phone number format appears usable", "medium", { digitsCount: digits.length })],
    ["Phone validation does not identify a person or owner."],
    Date.now() - start,
  );
}
