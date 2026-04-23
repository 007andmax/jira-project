# ============================================================
#  fix-angular-imports.ps1  (round 3)
#  Run: powershell -ExecutionPolicy Bypass -File "C:\Users\007andmax\Desktop\qt-ui\fix-angular-imports.ps1"
# ============================================================

$projectRoot = "C:\Users\007andmax\Desktop\qt-ui"
$srcPath = Join-Path $projectRoot "src"

Write-Host "Scanning project for component selectors..." -ForegroundColor Cyan

# ── STEP 1: Build selector map ───────────────────────────────
$selectorMap = @{}
Get-ChildItem -Recurse -Path $srcPath -Filter "*.ts" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw -Encoding UTF8 -ErrorAction SilentlyContinue
    if (-not $content) { return }
    if ($content -match "selector\s*:\s*'([^']+)'" -and $content -match "export\s+class\s+(\w+)") {
        $selectorMap[$Matches[1]] = @{
            class    = $content -replace '(?s).*export\s+class\s+(\w+).*', '$1'
            fullPath = $_.FullName
            relPath  = $_.FullName.Replace($projectRoot + "\", "").Replace("\", "/")
        }
        # re-extract class properly
        if ($content -match "export\s+class\s+(\w+)") {
            $selectorMap[($content -replace '(?s).*selector\s*:\s*''([^'']+)''.*', '$1')].class = $Matches[1]
        }
    }
}

# Better selector map build
$selectorMap = @{}
Get-ChildItem -Recurse -Path $srcPath -Filter "*.ts" | ForEach-Object {
    $fp = $_.FullName
    $raw = Get-Content $fp -Raw -Encoding UTF8 -ErrorAction SilentlyContinue
    if (-not $raw) { return }
    $selMatch = [regex]::Match($raw, "selector\s*:\s*'([^']+)'")
    $clsMatch = [regex]::Match($raw, "export\s+class\s+(\w+)")
    if ($selMatch.Success -and $clsMatch.Success) {
        $sel = $selMatch.Groups[1].Value
        $cls = $clsMatch.Groups[1].Value
        $rel = $fp.Replace($projectRoot + "\", "").Replace("\", "/")
        $selectorMap[$sel] = @{ class = $cls; fullPath = $fp; relPath = $rel }
    }
}
Write-Host "Found $($selectorMap.Count) selectors" -ForegroundColor Green

# ── STEP 2: Files needing CommonModule / FormsModule ─────────
$needsCommon = @(
    "src/app/components/billing/invoices/invoices-aside/invoices-aside.component.ts",
    "src/app/components/company-network-scan-beta/network-scan-credentials-aside/network-scan-credentials-aside.component.ts",
    "src/app/components/file-manager/file-manager-add-file/file-manager-add-file-drag-drop/file-manager-add-file-drag-drop.component.ts",
    "src/app/components/file-manager/file-manager-add-file/file-manager-add-file-tags/file-manager-add-file-tags.component.ts",
    "src/app/components/reports/report-menu/contract-detail-drop-down/contract-detail-drop-down.component.ts",
    "src/app/components/reports/report-menu/contract-detail-intervals-drop-down/contract-detail-intervals-drop-down.component.ts",
    "src/app/components/reports/report-menu/report-menu.component.ts",
    "src/app/components/reports/reports/software-summary-report/software-summary-devices-dro-down/software-summary-devices-dro-down.component.ts",
    "src/app/components/shared/draft-email/draft-email-recipients/draft-email-recipients.component.ts",
    "src/app/components/tasks/tasks-add/tasks-add-associate-tickets/tasks-add-associate-tickets.component.ts",
    "src/app/components/tickets/tickets/tickets-header/tickets-filter/tickets-filter-users-drop-down/tickets-filter-users-drop-down.component.ts",
    "src/app/components/users-details/users-details-tab-messages/users-details-tab-messages.component.ts",
    "src/app/components/users-details/users-details-tab-passwords/users-details-tab-passwords.component.ts",
    "src/app/components/users-details/users-details-tab-tickets/users-details-tab-tickets.component.ts",
    "src/app/components/users/add-user-to-company/add-user-to-company-selected-item/add-user-to-company-selected-item.component.ts",
    "src/app/services/modal/modal-image-cropper/modal-image-cropper.component.ts"
)

$needsForms = @(
    "src/app/components/billing/invoices/invoices-aside/invoices-aside.component.ts",
    "src/app/components/reports/report-menu/report-menu.component.ts",
    "src/app/components/tickets/tickets/tickets-header/tickets-filter/tickets-filter-search/tickets-filter-search.component.ts"
)

# ── STEP 3: Missing components map ───────────────────────────
$missingMap = @{
    "src/app/components/billing/billable/billable-aside/billable-aside.component.ts" = @("app-invoice-form")
    "src/app/components/billing/billable/billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit-product/invoice-form-ticket-edit-product.component.ts" = @("app-taxes")
    "src/app/components/billing/billable/billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit-service/invoice-form-ticket-edit-service.component.ts" = @("app-taxes")
    "src/app/components/billing/billable/billable-aside/invoice-form/invoice-form.component.ts" = @("app-invoice-form-edit-customer")
    "src/app/components/billing/invoices/invoices-aside/invoices-aside.component.ts" = @("app-date-picker","app-drop-down","app-mat-error","app-multi-company-drop-down","app-payments-cards","app-preloader-ticket")
    "src/app/components/billing/invoices/invoices-header/invoices-filter/invoices-filter.component.ts" = @("app-drop-down","app-multi-datepicker","company-drop-down")
    "src/app/components/billing/invoices/invoices-header/invoices-header.component.ts" = @("app-invoices-filter")
    "src/app/components/billing/payments/payments-header/payments-filter/payments-filter.component.ts" = @("app-drop-down","app-multi-datepicker","company-drop-down")
    "src/app/components/billing/payments/payments-header/payments-header.component.ts" = @("app-payments-filter")
    "src/app/components/billing/quotes/quote-aside-add/quote-aside-add-body/quote-aside-add-body.component.ts" = @("app-date-picker","app-invoice-form-edit-customer","app-service-list-quote")
    "src/app/components/billing/quotes/quote-aside-add/quote-aside-add.component.ts" = @("app-quote-aside-add-body")
    "src/app/components/billing/quotes/quote-aside-edit/quote-aside-edit-body/quote-aside-edit-body.component.ts" = @("app-service-list-quote")
    "src/app/components/billing/quotes/quote-aside-edit/quote-aside-edit.component.ts" = @("app-quote-aside-edit-body")
    "src/app/components/billing/quotes/quotes-header/quotes-filter/quotes-filter.component.ts" = @("app-drop-down","app-multi-datepicker","company-drop-down")
    "src/app/components/billing/quotes/quotes-header/quotes-header.component.ts" = @("app-quotes-filter")
    "src/app/components/companies/companies-header/companies-filter/companies-filter.component.ts" = @("app-company-tags","app-drop-down")
    "src/app/components/companies/companies.component.ts" = @("app-companies-header")
    "src/app/components/companies/company-add-aside/company-add-aside-full/company-add-aside-full.component.ts" = @("app-drop-down")
    "src/app/components/companies/company-documents/company-documents.component.ts" = @("documents-header")
    "src/app/components/companies/company-edit-aside/company-edit-aside.component.ts" = @("app-company-tags","app-drop-down","company-associate")
    "src/app/components/company-devices/company-devices-aside/company-devices-aside-network-tab/company-devices-aside-network-tab.component.ts" = @("app-company-devices-edit-ip","app-company-devices-edit-label","app-company-devices-edit-mac")
    "src/app/components/company-devices/company-devices-aside/company-devices-aside-system/company-devices-aside-system.component.ts" = @("app-company-devices-edit-label","app-date-picker","app-drop-down")
    "src/app/components/company-devices/company-devices-aside/company-devices-aside.component.ts" = @("app-company-devices-aside-network-tab","app-company-devices-aside-system")
    "src/app/components/company-devices/company-devices-filter/company-devices-filter.component.ts" = @("app-company-devices-filter-type")
    "src/app/components/company-devices/company-devices-item/company-devices-item.component.ts" = @("app-company-devices-tags")
    "src/app/components/company-devices/company-devices.component.ts" = @("app-company-devices-header")
    "src/app/components/company-network-scan-beta/network-scan-credentials-aside/network-scan-credentials-aside.component.ts" = @("app-network-scan-credentials-add","app-network-scan-credentials-aside-item")
    "src/app/components/company-password-manager/company-password-manager.component.ts" = @("app-passwoord-manager-filters")
    "src/app/components/company-tickets/company-tickets.component.ts" = @("app-tickets-filter","app-tickets-header")
    "src/app/components/company-user/company-user.component.ts" = @("app-users-filter","app-users-header")
    "src/app/components/device-old/software/software.component.ts" = @("software-header")
    "src/app/components/documents/documents-add/documents-add-info/documents-add-info.component.ts" = @("app-date-picker","app-drop-down","documents-linked")
    "src/app/components/documents/documents-edit/documents-edit-info/documents-edit-info.component.ts" = @("app-company-tags","app-drop-down","documents-linked")
    "src/app/components/documents/documents-header/documents-filter/documents-filter.component.ts" = @("app-company-tags","app-multi-datepicker","app-tech-users-list-report")
    "src/app/components/documents/documents-header/documents-header.component.ts" = @("documents-filter")
    "src/app/components/file-manager/file-manager-add-file/file-manager-add-file-tags/file-manager-add-file-tags.component.ts" = @("app-mat-chip","app-mat-chip-list","app-mat-form-field")
    "src/app/components/file-manager/file-manager-category/file-manager-category.component.ts" = @("app-file-manager-file-info")
    "src/app/components/file-manager/file-manager.component.ts" = @("app-file-manager-file-info")
    "src/app/components/inventory/inventory-header/inventory-filter/inventory-filter.component.ts" = @("app-drop-down")
    "src/app/components/inventory/inventory-header/inventory-header.component.ts" = @("inventory-filter")
    "src/app/components/inventory/inventory-table/inventory-table.component.ts" = @("app-drop-down")
    "src/app/components/inventory/inventory.component.ts" = @("app-inventory-table","inventory-header")
    "src/app/components/marketing/marketing.component.ts" = @("app-users-header")
    "src/app/components/reports/item-report/item-report.component.ts" = @("applicationbycompany-report","network-detail-report","network-ip-report","report-device-antivirus","report-device-diskspace","report-device-processorram","report-device-summary","report-device-warranty","software-summary-report1")
    "src/app/components/reports/report-menu/contract-detail-drop-down/contract-detail-drop-down.component.ts" = @("app-mat-error")
    "src/app/components/reports/report-menu/contract-detail-intervals-drop-down/contract-detail-intervals-drop-down.component.ts" = @("app-mat-error")
    "src/app/components/reports/report-menu/report-menu.component.ts" = @("app-drop-down","app-multi-company-drop-down","app-multi-datepicker","app-product-list","app-report-additional-actions","app-tech-users-list-report","company-drop-down","contract-company-drop-down","contract-detail-drop-down","contract-detail-intervals-drop-down","software-summary-devices-dro-down")
    "src/app/components/reports/reports/applicationbycompany-report/applicationbycompany-report.component.ts" = @("app-drop-down")
    "src/app/components/reports/reports/device-ip-summary-device-report/device-ip-summary-device-report.component.ts" = @("app-drop-down")
    "src/app/components/reports/reports/network-adapter-report/network-adapter-report.component.ts" = @("app-drop-down","app-report-send-email")
    "src/app/components/reports/reports/network-detail-report/network-detail-report.component.ts" = @("app-drop-down")
    "src/app/components/reports/reports/network-ip-report/network-ip-report.component.ts" = @("app-drop-down")
    "src/app/components/reports/reports/report-device-antivirus/report-device-antivirus.component.ts" = @("app-drop-down")
    "src/app/components/reports/reports/report-device-deploymentwarranty/report-device-deploymentwarranty.component.ts" = @("app-drop-down")
    "src/app/components/reports/reports/report-device-diskspace/report-device-diskspace.component.ts" = @("app-drop-down")
    "src/app/components/reports/reports/report-device-processorram/report-device-processorram.component.ts" = @("app-drop-down")
    "src/app/components/reports/reports/report-device-summary/report-device-summary.component.ts" = @("app-drop-down")
    "src/app/components/reports/reports/report-device-warranty/report-device-warranty.component.ts" = @("app-drop-down")
    "src/app/components/reports/reports/software-summary-report/software-summary-devices-dro-down/software-summary-devices-dro-down.component.ts" = @("app-mat-error")
    "src/app/components/reports/reports/software-summary-report1/software-summary-report1.component.ts" = @("app-drop-down")
    "src/app/components/setting/accounting/accounting-settings.component.ts" = @("accounting-year","app-gl-number-settings","app-invoice-settings","app-quotes-settings","app-taxes-settings","custom-notes-settings")
    "src/app/components/setting/company-profile/company-profile.component.ts" = @("app-company-profile-api-keys","app-company-profile-operational-hours","app-company-profile-profile","app-company-profile-workspace")
    "src/app/components/setting/manage-tags/manage-tags.component.ts" = @("app-manage-tags-devices","app-manage-tags-files")
    "src/app/components/setting/marketing-email/marketing-email-users/marketing-email-users.component.ts" = @("marketing-email-users-add")
    "src/app/components/setting/marketing-email/marketing-email.component.ts" = @("marketing-subscription-type")
    "src/app/components/setting/my-profile/my-profile.component.ts" = @("app-account","app-activity-history","app-email-notifications","app-profile","tickets-my-profile")
    "src/app/components/setting/my-profile/signature/signature.component.ts" = @("edit-signature")
    "src/app/components/setting/my-profile/tickets-my-profile/tickets-my-profile.component.ts" = @("app-drop-down")
    "src/app/components/setting/tech-users-settings/tech-users-settings.component.ts" = @("app-permission-manage")
    "src/app/components/setting/ticket-settings-page/canned-responses/canned-responses-aside/canned-responses-aside.component.ts" = @("app-mat-error")
    "src/app/components/shared/draft-email/draft-email-recipients/draft-email-recipients.component.ts" = @("app-mat-chip","app-mat-chip-list","app-mat-error","app-mat-form-field")
    "src/app/components/shared/draft-email/draft-email.component.ts" = @("app-upload-area")
    "src/app/components/super-admin-public/help-center-info-aside/help-center-info-aside.component.ts" = @("app-super-admin-public-list")
    "src/app/components/super-admin/super-admin-knowledge-base/super-admin-knowledge-base-table/super-admin-knowledge-base-table.component.ts" = @("app-super-admin-knowledge-base-add","app-super-admin-knowledge-base-edit")
    "src/app/components/super-admin/super-admin-knowledge-base/super-admin-knowledge-base.component.ts" = @("app-super-admin-knowledge-base-table")
    "src/app/components/super-admin/support-page/support-page-category/support-page-category.component.ts" = @("support-page-body","support-page-header")
    "src/app/components/tasks/tasks-add/tasks-add.component.ts" = @("app-services-list")
    "src/app/components/tasks/tasks-calendar/tasks-calendar.component.ts" = @("app-tasks-calendar-month","app-tasks-calendar-week")
    "src/app/components/tasks/tasks-edit/tasks-edit.component.ts" = @("app-tasks-date-picker")
    "src/app/components/tickets/recurring-tickets/recurring-tickets-add-aside/recurring-tickets-add-aside.component.ts" = @("app-assigned-ticket-user","app-devices-recurring-tickets")
    "src/app/components/tickets/recurring-tickets/recurring-tickets-edit-aside/recurring-tickets-edit-aside.component.ts" = @("app-devices-recurring-tickets")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-add-assigned-user/ticket-detail-add-assigned-user.component.ts" = @("app-add-assigned-user")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-change-status/ticket-detail-change-status.component.ts" = @("app-drop-down")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-contact-details/ticket-detail-contact-details.component.ts" = @("ticket-detail-contact-details-history")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-note-modal/ticket-detail-note-modal.component.ts" = @("ticket-detail-profile-form-update-note")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-profile-edit-updates/ticket-detail-profile-edit-updates-products/ticket-detail-profile-edit-updates-products.component.ts" = @("app-invoice-form-ticket-edit-taxes","app-product-list")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-profile-edit-updates/ticket-detail-profile-edit-updates-services/ticket-detail-profile-edit-updates-services.component.ts" = @("app-date-picker","app-services-list","app-ticket-profile-updates-service-duration","app-ticket-profile-updates-service-timepicker")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-profile-edit-updates/ticket-detail-profile-edit-updates.component.ts" = @("ticket-detail-profile-edit-updates-products","ticket-detail-profile-edit-updates-services")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-profile-form-update/ticket-detail-profile-form-update-products/ticket-detail-profile-form-update-products.component.ts" = @("app-product-list")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-profile-form-update/ticket-detail-profile-form-update-services/ticket-detail-profile-form-update-services.component.ts" = @("app-date-picker","app-ticket-profile-updates-service-duration","app-ticket-profile-updates-service-timepicker")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-profile-form-update/ticket-detail-profile-form-update.component.ts" = @("ticket-detail-profile-form-update-header","ticket-detail-profile-form-update-note","ticket-detail-profile-form-update-products","ticket-detail-profile-form-update-services","ticket-profile-form-update-note-list")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-profile-updates/ticket-detail-profile-updates-note/ticket-detail-profile-updates-note.component.ts" = @("ticket-detail-profile-updates-note-item")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-profile-updates/ticket-detail-profile-updates-product/ticket-detail-profile-updates-product-info/ticket-detail-profile-updates-product-info.component.ts" = @("app-date-picker")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-profile-updates/ticket-detail-profile-updates-service/ticket-detail-profile-updates-service-info/ticket-detail-profile-updates-service-info.component.ts" = @("app-date-picker")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-tasks/ticket-detail-tasks-item/ticket-detail-tasks-item.component.ts" = @("app-tasks-date-picker","app-tech-users")
    "src/app/components/tickets/tickets/tickets-header/tickets-filter/tickets-filter-users-drop-down/tickets-filter-users-drop-down.component.ts" = @("app-dynamic-tooltip","app-mat-chip","app-mat-chip-list","app-mat-form-field")
    "src/app/components/tickets/tickets/tickets-header/tickets-filter/tickets-filter.component.ts" = @("app-tickets-filter-tags","tickets-filter-companies-drop-down","tickets-filter-created-drop-down","tickets-filter-drop-down","tickets-filter-status")
    "src/app/components/users-details/users-details-tab-companies/users-details-tab-companies-add/users-details-tab-companies-add.component.ts" = @("app-drop-down")
    "src/app/components/users-details/users-details-tab-companies/users-details-tab-companies-item/users-details-tab-companies-item.component.ts" = @("app-drop-down")
    "src/app/components/users-details/users-details-tab-companies/users-details-tab-companies.component.ts" = @("app-users-details-tab-companies-item")
    "src/app/components/users-details/users-details-tab-messages/users-details-tab-messages.component.ts" = @("app-users-details-tab-messages-full-body")
    "src/app/components/users-details/users-details-tab-passwords/users-details-tab-passwords.component.ts" = @("app-users-details-tab-passwords-item")
    "src/app/components/users-details/users-details-tab-tickets/users-details-tab-tickets.component.ts" = @("app-users-details-tab-tickets-item")
    "src/app/components/users-details/users-details.component.ts" = @("app-users-details-left-panel")
    "src/app/components/users/users-aside-edit/users-aside-edit.component.ts" = @("app-company-tags","app-drop-down")
    "src/app/components/users/users-aside/users-aside.component.ts" = @("app-drop-down")
    "src/app/components/users/users-header/users-filter/users-filter-default-subscription/users-filter-default-subscription.component.ts" = @("app-mat-form-field")
    "src/app/components/users/users-header/users-filter/users-filter.component.ts" = @("app-users-filter-custom-subscriptions","app-users-filter-default-subscription","app-users-filter-job-title","app-users-filter-tags","tickets-filter-companies-drop-down")
    "src/app/components/users/users-table/users-table.component.ts" = @("user-table-custom-subscription")
    "src/app/components/users/users.component.ts" = @("app-users-header")
}

# ── STEP 4: Collect all files to process ─────────────────────
$allFiles = (@($needsCommon) + @($needsForms) + @($missingMap.Keys)) | Sort-Object -Unique

$fixedCount = 0
$skipped = @()

foreach ($relPath in $allFiles) {
    $fullPath = Join-Path $projectRoot $relPath.Replace('/', '\')
    if (-not (Test-Path $fullPath)) { Write-Warning "NOT FOUND: $relPath"; continue }

    $content = Get-Content $fullPath -Raw -Encoding UTF8
    $changed = $false
    $addImportLines = @()
    $addClassNames  = @()

    # CommonModule
    if (($needsCommon -contains $relPath) -and ($content -notmatch '\bCommonModule\b')) {
        $addImportLines += "import { CommonModule } from '@angular/common';"
        $addClassNames  += "CommonModule"
        $changed = $true
    }
    # FormsModule
    if (($needsForms -contains $relPath) -and ($content -notmatch '\bFormsModule\b')) {
        $addImportLines += "import { FormsModule } from '@angular/forms';"
        $addClassNames  += "FormsModule"
        $changed = $true
    }

    # Missing child components
    if ($missingMap.ContainsKey($relPath)) {
        foreach ($sel in $missingMap[$relPath]) {
            if (-not $selectorMap.ContainsKey($sel)) {
                $skipped += "$sel (in $relPath)"
                continue
            }
            $info = $selectorMap[$sel]
            $cls  = $info.class
            if ($content -match "\b$cls\b") { continue }

            $childFull = $info.fullPath
            $parentDir = [System.IO.Path]::GetDirectoryName($fullPath)
            $rel = [System.IO.Path]::GetRelativePath($parentDir, $childFull) -replace '\\','/' -replace '\.ts$',''
            if (-not $rel.StartsWith('.')) { $rel = "./$rel" }

            $addImportLines += "import { $cls } from '$rel';"
            $addClassNames  += $cls
            $changed = $true
        }
    }

    if ($changed) {
        $importBlock = ($addImportLines | Select-Object -Unique) -join "`n"
        $content = $importBlock + "`n" + $content

        $classBlock = ($addClassNames | Select-Object -Unique) -join ", "
        if ($content -match "imports\s*:\s*\[") {
            $content = $content -replace "imports\s*:\s*\[", "imports: [$classBlock, "
        } else {
            $content = $content -replace "(@Component\(\s*\{)", "`$1`n  standalone: true,`n  imports: [$classBlock],"
        }

        Set-Content $fullPath $content -Encoding UTF8 -NoNewline
        Write-Host "FIXED: $relPath" -ForegroundColor Green
        $fixedCount++
    }
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "Fixed: $fixedCount files" -ForegroundColor Green
if ($skipped.Count -gt 0) {
    Write-Host ""
    Write-Host "Skipped (3rd party / not found) $($skipped.Count):" -ForegroundColor Yellow
    $skipped | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
}
Write-Host ""
Write-Host "Next: ng build 2> build4.log" -ForegroundColor Cyan
