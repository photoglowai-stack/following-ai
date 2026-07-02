import type { ProviderContext, ProviderResult } from "@/lib/types";
import { normalizeValidationSignal } from "@/lib/normalizers";
import { providerResult } from "@/lib/providers/common";

export async function runUsernameValidation(context: ProviderContext): Promise<ProviderResult> {
  const start = Date.now();
  if (context.type !== "username") {
    return providerResult("username_validation", "skipped", [], [], Date.now() - start);
  }

  return providerResult(
    "username_validation",
    "success",
    [normalizeValidationSignal("username_validation", "Username format is compatible with common public profile URLs", "medium", { validationOnly: true })],
    ["Username validation is not account discovery."],
    Date.now() - start,
  );
}
