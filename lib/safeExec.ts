import { execFile } from "node:child_process";
import path from "node:path";
import { redactSensitiveText } from "@/lib/masking";

export interface SafeExecOptions {
  timeoutMs: number;
  maxBuffer?: number;
}

export interface SafeExecResult {
  ok: boolean;
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timedOut: boolean;
}

export function safeExec(command: string, args: string[], options: SafeExecOptions): Promise<SafeExecResult> {
  const maxBuffer = options.maxBuffer ?? 512 * 1024;

  return new Promise((resolve) => {
    const child = execFile(
      command,
      args.map((arg) => String(arg)),
      {
        shell: false,
        timeout: options.timeoutMs,
        maxBuffer,
        windowsHide: true,
        env: {
          ...process.env,
          PATH: providerPath(),
        },
      },
      (error, stdout, stderr) => {
        const execError = error as (NodeJS.ErrnoException & { signal?: string }) | null;
        const timedOut = execError?.signal === "SIGTERM" || execError?.code === "ETIMEDOUT";
        resolve({
          ok: !error,
          stdout: redactSensitiveText(stdout.toString()),
          stderr: redactSensitiveText(stderr.toString()),
          exitCode: typeof execError?.code === "number" ? execError.code : error ? 1 : 0,
          timedOut,
        });
      },
    );

    child.on("error", (error: NodeJS.ErrnoException) => {
      resolve({
        ok: false,
        stdout: "",
        stderr: redactSensitiveText(error.message),
        exitCode: typeof error.code === "number" ? error.code : 1,
        timedOut: false,
      });
    });
  });
}

export async function commandExists(commandName: string | null): Promise<boolean> {
  if (!commandName) {
    return false;
  }

  const paths = providerPath().split(":").filter(Boolean);
  const fs = await import("node:fs/promises");
  for (const path of paths) {
    try {
      await fs.access(`${path}/${commandName}`);
      return true;
    } catch {
      // Continue searching PATH.
    }
  }
  return false;
}

function providerPath(): string {
  return [path.join(process.cwd(), ".venv", "bin"), process.env.PATH ?? ""].filter(Boolean).join(":");
}
