import { execSync } from "child_process";

const SEARCH_PATTERNS = {
  sensitiveData: "(API_KEY|SECRET|PASSWORD|TOKEN)",
  consoleStatements: "console\\.(log|error|warn|info|debug)",
  storageUsage: "(localStorage|sessionStorage)",
  inlineScripts: "<script>[^<]*</script>",
  externalScripts: "<script.*src=",
};

const SEARCH_DIRECTORIES = ["apps", "packages", "services"];

function searchInFiles(pattern: string): string[] {
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

async function runSecurityAudit(): Promise<void> {
  console.log("🔒 Running Security Audit...\n");

  // Check for sensitive data exposure
  console.log("Checking for potential sensitive data exposure...");
  const sensitiveResults = searchInFiles(SEARCH_PATTERNS.sensitiveData);
  if (sensitiveResults.length > 0) {
    console.warn("⚠️ Found potential sensitive data:");
    console.log(sensitiveResults.join("\n"));
  } else {
    console.log("✅ No sensitive data found");
  }

  // Check for console statements
  console.log("\nChecking for console statements...");
  const consoleResults = searchInFiles(SEARCH_PATTERNS.consoleStatements);
  if (consoleResults.length > 0) {
    console.warn("⚠️ Found console statements:");
    console.log(consoleResults.join("\n"));
  } else {
    console.log("✅ No console statements found");
  }

  // Check for storage usage
  console.log("\nChecking for localStorage/sessionStorage usage...");
  const storageResults = searchInFiles(SEARCH_PATTERNS.storageUsage);
  if (storageResults.length > 0) {
    console.warn("⚠️ Found storage usage:");
    console.log(storageResults.join("\n"));
  } else {
    console.log("✅ No storage usage found");
  }

  // Check for inline scripts
  console.log("\nChecking for inline scripts...");
  const inlineScriptResults = searchInFiles(SEARCH_PATTERNS.inlineScripts);
  if (inlineScriptResults.length > 0) {
    console.warn("⚠️ Found inline scripts:");
    console.log(inlineScriptResults.join("\n"));
  } else {
    console.log("✅ No inline scripts found");
  }

  // Check for external script tags
  console.log("\nChecking for external script tags...");
  const externalScriptResults = searchInFiles(SEARCH_PATTERNS.externalScripts);
  if (externalScriptResults.length > 0) {
    console.warn("⚠️ Found external script tags:");
    console.log(externalScriptResults.join("\n"));
  } else {
    console.log("✅ No external script tags found");
  }
}

if (require.main === module) {
  runSecurityAudit().catch(console.error);
}

export { runSecurityAudit };
