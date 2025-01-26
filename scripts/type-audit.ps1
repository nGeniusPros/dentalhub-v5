# TypeScript Audit Script
Write-Host "Running TypeScript Audit..."

# Check TypeScript version
Write-Host "`nTypeScript Version:"
pnpm exec tsc --version

# Run type checking
Write-Host "`nRunning type check..."
pnpm exec tsc --noEmit --strict 2>typescript-errors.log

# Find any types
Write-Host "`nFinding 'any' type usage..."
$anyTypes = Select-String -Path "apps/**/*.ts","packages/**/*.ts","services/**/*.ts" -Pattern ": any" -CaseSensitive
Write-Host "Found $($anyTypes.Count) instances of 'any' type"

# Check unused exports
Write-Host "`nChecking unused exports..."
pnpm dlx ts-prune | Out-File unused-exports.txt

# Generate report
Write-Host "`nGenerating report..."
$report = @"
# TypeScript Audit Report
Generated: $(Get-Date)

## Type Usage Statistics
- Total 'any' types found: $($anyTypes.Count)
- Unused exports: $(Get-Content unused-exports.txt | Measure-Object -Line).Lines

## Files with most 'any' types:
$(
    $anyTypes | 
    Group-Object Filename | 
    Sort-Object Count -Descending | 
    Select-Object -First 10 | 
    ForEach-Object { "- $($_.Name): $($_.Count) instances" }
)

## Next Steps
1. Review typescript-errors.log for type errors
2. Check unused-exports.txt for dead code
3. Begin replacing 'any' types in files listed above
"@

$report | Out-File type-audit-report.md

Write-Host "`nAudit complete! Check the following files:"
Write-Host "- typescript-errors.log: Type checking errors"
Write-Host "- unused-exports.txt: Unused exports"
Write-Host "- type-audit-report.md: Summary report"
