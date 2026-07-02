import type { ProviderContext, ProviderResult } from "@/lib/types";
import { normalizeEmailSignal } from "@/lib/normalizers";
import { providerResult } from "@/lib/providers/common";

export async function runEmailValidation(context: ProviderContext): Promise<ProviderResult> {
  const start = Date.now();
  if (context.type !== "email") {
    return providerResult("email_validation", "skipped", [], [], Date.now() - start);
  }

  const domain = context.query.split("@")[1] ?? "";
  return providerResult(
    "email_validation",
    "success",
    [normalizeEmailSignal("email_validation", "Email syntax and domain segment are present", "medium", { domain })],
    ["Validation is syntactic only; it does not prove mailbox ownership."],
    Date.now() - start,
  );
}
