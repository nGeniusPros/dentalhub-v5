import { execSync } from "child_process";

interface AuditResult {
  success: boolean;
  output: string;
  error?: string;
}

const SEARCH_DIRECTORIES = ["apps", "packages", "services"];

async function runCommand(command: string): Promise<AuditResult> {
  try {
    const output = execSync(command, { encoding: "utf8" });
    return { success: true, output };
  } catch (error: any) {
    return {
      success: false,
      output: error.stdout?.toString() || "",
      error: error.stderr?.toString() || error.message,
    };
  }
}

async function searchInDirectories(pattern: string): Promise<string[]> {
  const results: string[] = [];
  for (const dir of SEARCH_DIRECTORIES) {
    try {
      const output = execSync(
        `powershell -Command "if (Test-Path ${dir}) { Get-ChildItem -Path '${dir}' -Recurse -Include *.ts,*.tsx,*.js,*.jsx | Select-String -Pattern '${pattern}' | Format-Table Path,LineNumber,Line -AutoSize }"`,
        { encoding: "utf8" },
      );
      if (output.trim()) {
        results.push(output);
      }
    } catch (error) {
      // Ignore errors when directory doesn't exist
      if (
        error instanceof Error &&
        !error.message.includes("Cannot find path")
      ) {
        console.error(
          `Error searching for pattern ${pattern} in ${dir}:`,
          error,
        );
      }
    }
  }
  return results;
}

async function runCodeQualityAudit(): Promise<void> {
  console.log("🔍 Running Code Quality Audit...\n");

  // Type checking
  console.log("Running TypeScript type check...");
  const typeCheckResult = await runCommand("pnpm type-check");
  console.log(
    typeCheckResult.success ? "✅ Type check passed" : "❌ Type check failed",
  );
  if (!typeCheckResult.success) {
    console.error(typeCheckResult.error);
  }

  // ESLint
  console.log("\nRunning ESLint...");
  const eslintResult = await runCommand("pnpm lint");
  console.log(
    eslintResult.success ? "✅ ESLint check passed" : "❌ ESLint check failed",
  );
  if (!eslintResult.success) {
    console.error(eslintResult.error);
  }

  // Find unused exports
  console.log("\nChecking for unused exports...");
  const unusedExportsResult = await runCommand("pnpm find-any");
  if (unusedExportsResult.output.trim()) {
    console.warn("⚠️ Found unused exports:");
    console.log(unusedExportsResult.output);
  } else {
    console.log("✅ No unused exports found");
  }

  // Check for CommonJS require statements
  console.log("\nChecking for CommonJS require statements...");
  const requireResults = await searchInDirectories("require\\(");
  if (requireResults.length > 0) {
    console.warn("⚠️ Found CommonJS require statements:");
    console.log(requireResults.join("\n"));
  } else {
    console.log("✅ No CommonJS require statements found");
  }

  // Check for relative path imports beyond 2 levels
  console.log("\nChecking for deep relative imports...");
  const deepImportResults = await searchInDirectories(
    'from \\"\\.\\.\\./\\.\\./',
  );
  if (deepImportResults.length > 0) {
    console.warn("⚠️ Found deep relative imports:");
    console.log(deepImportResults.join("\n"));
  } else {
    console.log("✅ No deep relative imports found");
  }

  // Format code
  console.log("\nFormatting code with Prettier...");
  const formatResult = await runCommand("pnpm format");
  console.log(
    formatResult.success
      ? "✅ Code formatting complete"
      : "❌ Code formatting failed",
  );
  if (!formatResult.success) {
    console.error(formatResult.error);
  }
}

if (require.main === module) {
  runCodeQualityAudit().catch(console.error);
}

export { runCodeQualityAudit };
