# ============================================================
#  fix-missing-components.ps1
#  Auto-discovers component class names from selectors and
#  adds missing imports to parent components
#  Run: powershell -ExecutionPolicy Bypass -File "C:\Users\007andmax\Desktop\qt-ui\fix-missing-components.ps1"
# ============================================================

$projectRoot = "C:\Users\007andmax\Desktop\qt-ui"
$srcPath = Join-Path $projectRoot "src"

Write-Host "Scanning project for component selectors..." -ForegroundColor Cyan

# ── STEP 1: Build selector -> {className, filePath} map ─────
$selectorMap = @{}

Get-ChildItem -Recurse -Path $srcPath -Filter "*.ts" | ForEach-Object {
    $filePath = $_.FullName
    $content = Get-Content $filePath -Raw -Encoding UTF8 -ErrorAction SilentlyContinue
    if (-not $content) { return }

    # Find selector in @Component decorator
    if ($content -match "selector\s*:\s*'([^']+)'") {
        $selector = $Matches[1]

        # Find exported class name
        if ($content -match "export\s+class\s+(\w+)") {
            $className = $Matches[1]
            $relPath = $filePath.Replace($projectRoot + "\", "").Replace("\", "/")
            $selectorMap[$selector] = @{ class = $className; path = $relPath; fullPath = $filePath }
        }
    }
}

Write-Host "Found $($selectorMap.Count) components/directives in project" -ForegroundColor Green
Write-Host ""

# ── STEP 2: missing map from build log analysis ──────────────
$missingMap = @{
    "src/app/app.component.ts" = @("app-company-add-aside","app-draft-email","app-inventory-add-aside","app-inventory-edit-aside","app-invoices-aside","app-invoices-aside-preview","app-main","app-manage-cards-add","app-manage-cards-edit","app-map-modal","app-marketing-subscriptions-aside","app-modal-session-screen","app-non-contract-services-add","app-non-contract-services-edit","app-notifications","app-preview-attachment","app-preview-file","app-quote-aside-preview","app-report-send-email","app-tasks-add","app-tasks-edit","app-ticket-add-aside","app-users-aside","breadcrumbs","canned-responses-aside","help-center-info-aside","modal-image-cropper","modal-lock-screen","users-aside-edit")
    "src/app/components/billing/billable/billable-aside/billable-aside.component.ts" = @("app-invoice-form","app-invoice-preview","app-preloader-ticket")
    "src/app/components/billing/billable/billable-aside/invoice-form/invoice-form-edit-customer/invoice-form-edit-customer.component.ts" = @("app-mat-error")
    "src/app/components/billing/billable/billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit-product/invoice-form-ticket-edit-product.component.ts" = @("app-mat-error","app-taxes")
    "src/app/components/billing/billable/billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit-service/invoice-form-ticket-edit-service.component.ts" = @("app-taxes","app-ticket-profile-updates-service-duration","app-ticket-profile-updates-service-timepicker")
    "src/app/components/billing/billable/billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit.component.ts" = @("app-invoice-form-ticket-edit-product","app-invoice-form-ticket-edit-service")
    "src/app/components/billing/billable/billable-aside/invoice-form/invoice-form-ticket-info/invoice-form-ticket-info.component.ts" = @("app-dynamic-tooltip")
    "src/app/components/billing/billable/billable-aside/invoice-form/invoice-form.component.ts" = @("app-date-picker","app-invoice-discount","app-invoice-form-edit-customer","app-invoice-form-ticket-edit","app-invoice-form-ticket-info","app-invoice-regular-note","app-mat-error","app-preloader-ticket","invoice-change-address")
    "src/app/components/billing/billable/billable-aside/invoice-preview/invoice-preview.component.ts" = @("app-dynamic-tooltip","preview-phone-mask")
    "src/app/components/billing/billable/billable-tickets/billable-tickets.component.ts" = @("app-billable-aside")
    "src/app/components/billing/invoices/invoices-aside-preview/invoices-aside-preview.component.ts" = @("app-dynamic-tooltip","preview-phone-mask")
    "src/app/components/billing/invoices/invoices-header/invoices-filter/invoices-filter.component.ts" = @("app-drop-down","app-multi-datepicker","company-drop-down")
    "src/app/components/billing/invoices/invoices-header/invoices-header.component.ts" = @("app-invoices-filter","invoice-export")
    "src/app/components/billing/invoices/invoices.component.ts" = @("app-invoices-header","app-invoices-item")
    "src/app/components/billing/manage-cards/manage-cards.component.ts" = @("app-manage-cards-header","app-manage-cards-table")
    "src/app/components/billing/payments/edit-payment/edit-payment.component.ts" = @("app-date-picker","app-drop-down","app-mat-error","app-preloader-ticket")
    "src/app/components/billing/payments/payments-aside/payments-aside.component.ts" = @("preview-phone-mask")
    "src/app/components/billing/payments/payments-cards/payments-cards.component.ts" = @("app-mat-error")
    "src/app/components/billing/payments/payments-header/payments-filter/payments-filter.component.ts" = @("app-drop-down","app-multi-datepicker","company-drop-down")
    "src/app/components/billing/payments/payments-header/payments-header.component.ts" = @("app-payments-filter","invoice-export")
    "src/app/components/billing/payments/payments.component.ts" = @("app-edit-payment","app-payment-item","app-payments-aside","app-payments-header","app-refund-payment")
    "src/app/components/billing/payments/refund-payment/refund-payment.component.ts" = @("app-preloader-ticket")
    "src/app/components/billing/quotes/quote-aside-add/product-item-quote/product-item-quote.component.ts" = @("app-mat-error")
    "src/app/components/billing/quotes/quote-aside-add/product-list-quote/product-list-quote.component.ts" = @("app-mat-error","ngb-accordion","ngb-panel")
    "src/app/components/billing/quotes/quote-aside-add/quote-aside-add-body/quote-aside-add-body.component.ts" = @("app-date-picker","app-drop-down","app-invoice-form-edit-customer","app-invoice-regular-note","app-mat-error","app-product-item-quote","app-product-list-quote","app-service-item-quote","app-service-list-quote","quote-aside-add-change-address")
    "src/app/components/billing/quotes/quote-aside-add/quote-aside-add.component.ts" = @("app-preloader-ticket","app-quote-aside-add-body","app-quote-aside-preview-body")
    "src/app/components/billing/quotes/quote-aside-add/service-item-quote/service-item-quote.component.ts" = @("app-drop-down")
    "src/app/components/billing/quotes/quote-aside-edit/product-item-quote-edit/product-item-quote-edit.component.ts" = @("app-mat-error")
    "src/app/components/billing/quotes/quote-aside-edit/quote-aside-edit-body/quote-aside-edit-body.component.ts" = @("app-date-picker","app-drop-down","app-invoice-form-edit-customer","app-invoice-regular-note","app-mat-error","app-product-item-quote-edit","app-product-list-quote","app-service-list-quote","quote-aside-add-change-address")
    "src/app/components/billing/quotes/quote-aside-edit/quote-aside-edit.component.ts" = @("app-preloader-ticket","app-quote-aside-edit-body","app-quote-aside-preview-body")
    "src/app/components/billing/quotes/quote-aside-preview/quote-aside-preview-body/quote-aside-preview-body.component.ts" = @("preview-phone-mask")
    "src/app/components/billing/quotes/quote-aside-preview/quote-aside-preview.component.ts" = @("app-quote-aside-preview-body")
    "src/app/components/billing/quotes/quotes-header/quotes-filter/quotes-filter.component.ts" = @("app-drop-down","app-multi-datepicker","company-drop-down")
    "src/app/components/billing/quotes/quotes-header/quotes-header.component.ts" = @("app-quotes-filter")
    "src/app/components/billing/quotes/quotes-table/quotes-table.component.ts" = @("app-quotes-header","app-quotes-item")
    "src/app/components/billing/quotes/quotes.component.ts" = @("app-quote-aside-add","app-quote-aside-edit","app-quotes-table")
    "src/app/components/companies/companies-header/companies-filter/companies-filter.component.ts" = @("app-company-tags","app-drop-down")
    "src/app/components/companies/companies-table/companies-table.component.ts" = @("app-dynamic-tooltip","preview-phone-mask")
    "src/app/components/companies/companies-users-details/companies-users-details.component.ts" = @("app-users-details-header","app-users-details-left-panel","app-users-details-tab-companies","app-users-details-tab-documents","app-users-details-tab-messages","app-users-details-tab-passwords","app-users-details-tab-tickets")
    "src/app/components/companies/companies.component.ts" = @("app-companies-header","app-companies-table","app-company-edit-aside","companies-filter")
    "src/app/components/companies/company-add-aside/company-add-aside-full/company-add-aside-full.component.ts" = @("app-company-tags","app-company-time-zone","app-drop-down","app-mat-error","app-users-drop-down","company-associate","user-default-subscription")
    "src/app/components/companies/company-add-aside/company-add-aside-short/company-add-aside-short.component.ts" = @("app-drop-down","app-mat-error","app-users-drop-down")
    "src/app/components/companies/company-add-aside/company-add-aside.component.ts" = @("app-preloader-ticket","company-add-aside-full","company-add-aside-short")
    "src/app/components/companies/company-documents/company-documents.component.ts" = @("company-documents-table","documents-header","documents-templates-info")
    "src/app/components/companies/company-edit-aside/company-edit-aside.component.ts" = @("app-company-tags","app-company-time-zone","app-drop-down","app-mat-error","app-preloader-ticket","company-associate","user-default-subscription")
    "src/app/components/companies/company-file-manager/company-file-manager-category/company-file-manager-category.component.ts" = @("app-company-file-manager-header","app-file-manager-file-info")
    "src/app/components/companies/company-file-manager/company-file-manager.component.ts" = @("app-company-file-manager-header","app-file-manager-file-info")
    "src/app/components/companies/company-products/company-products.component.ts" = @("app-report-menu")
    "src/app/components/companies/company-tags/company-tags.component.ts" = @("app-mat-chip-list")
    "src/app/components/company-dashboard/company-dash-associate-info/company-dash-associate-info.component.ts" = @("preview-phone-mask")
    "src/app/components/company-dashboard/company-dash-associate/company-dash-associate.component.ts" = @("company-associate")
    "src/app/components/company-dashboard/company-dash-contract/company-dash-contract.component.ts" = @("app-contracts-edit","app-contracts-preview")
    "src/app/components/company-dashboard/company-dash-detail/company-dash-detail.component.ts" = @("app-company-tags")
    "src/app/components/company-dashboard/company-dash-revenue/company-dash-revenue.component.ts" = @("ngx-charts-pie-chart")
    "src/app/components/company-dashboard/company-dash-ticket/company-dash-ticket.component.ts" = @("ngx-charts-line-chart")
    "src/app/components/company-dashboard/company-dashboard.component.ts" = @("app-company-dash-contract","app-company-dash-detail","app-company-dash-invoice","app-company-dash-revenue","app-company-dash-stats","app-company-dash-ticket","app-company-edit-aside","company-dash-associate","company-dash-associate-info")
    "src/app/components/company-devices/company-devices-aside/company-devices-aside-network-tab/company-devices-aside-network-tab.component.ts" = @("app-company-devices-edit-ip","app-company-devices-edit-label","app-company-devices-edit-mac")
    "src/app/components/company-devices/company-devices-aside/company-devices-aside-system/company-devices-aside-system.component.ts" = @("app-company-devices-edit-ip","app-company-devices-edit-label","app-date-picker","app-drop-down")
    "src/app/components/company-devices/company-devices-aside/company-devices-aside.component.ts" = @("app-company-devices-aside-device-icon","app-company-devices-aside-network-tab","app-company-devices-aside-software","app-company-devices-aside-system","app-company-devices-aside-updates")
    "src/app/components/company-devices/company-devices-edit-ip/company-devices-edit-ip.component.ts" = @("app-mat-error")
    "src/app/components/company-devices/company-devices-edit-mac/company-devices-edit-mac.component.ts" = @("app-mat-error")
    "src/app/components/company-devices/company-devices-filter/company-devices-filter-type/company-devices-filter-type.component.ts" = @("app-dynamic-tooltip","app-mat-chip","app-mat-chip-list","app-mat-form-field")
    "src/app/components/company-devices/company-devices-filter/company-devices-filter.component.ts" = @("app-company-devices-filter-type")
    "src/app/components/company-devices/company-devices-item/company-devices-item.component.ts" = @("app-company-devices-exist-remote-sessions","app-company-devices-no-exist-remote-sessions","app-company-devices-tags")
    "src/app/components/company-devices/company-devices-tags/company-devices-tags.component.ts" = @("app-mat-chip","app-mat-chip-list")
    "src/app/components/company-devices/company-devices.component.ts" = @("app-company-devices-aside","app-company-devices-custom-aside","app-company-devices-filter","app-company-devices-header","app-company-devices-item")
    "src/app/components/company-network-scan/company-network-scan.component.ts" = @("app-company-network-scan-item","app-company-network-scan-no-exist-devices","app-network-scan-credentials-aside")
    "src/app/components/company-password-manager/company-password-manager.component.ts" = @("app-passwoord-manager-filters","app-passwoord-manager-header","app-password-manager-add-aside","app-password-manager-edit-aside","app-password-manager-table")
    "src/app/components/company-tickets/company-tickets.component.ts" = @("app-merge-tickets","app-tickets-filter","app-tickets-header","app-tickets-table-item")
    "src/app/components/company-user/company-user.component.ts" = @("app-users-filter","app-users-header","app-users-table")
    "src/app/components/device-old/dashboard/dashboard-details-dashboard/dashboard-details-dashboard.component.ts" = @("app-date-picker")
    "src/app/components/device-old/dashboard/dashboard.component.ts" = @("dashboard-details-dashboard","dashboard-disk-drives","dashboard-services","dashboard-tags")
    "src/app/components/device-old/device-old.component.ts" = @("nav-old")
    "src/app/components/device-old/software/software.component.ts" = @("app-ticket-task","software-header")
    "src/app/components/device/dashboard/dashboard.component.ts" = @("app-drop-down","app-mat-chip","app-mat-chip-list","app-mat-form-field")
    "src/app/components/devices/devices-report/devices-report.component.ts" = @("app-report-list-item")
    "src/app/components/documents/documents-add/documents-add-info/documents-add-info.component.ts" = @("app-company-tags","app-date-picker","app-drop-down","app-mat-error","documents-add-edit-categories","documents-linked")
    "src/app/components/documents/documents-add/documents-add.component.ts" = @("app-documents-add-body","app-documents-add-footer","app-documents-add-header","app-documents-add-info")
    "src/app/components/documents/documents-category/documents-category.component.ts" = @("documents-header","documents-table","documents-templates-info")
    "src/app/components/documents/documents-edit-category/documents-edit-category.component.ts" = @("app-preloader-ticket","documents-edit-category-item")
    "src/app/components/documents/documents-edit/documents-edit-info/documents-edit-info.component.ts" = @("app-company-tags","app-date-picker","app-drop-down","app-mat-error","documents-add-edit-categories","documents-edit-history","documents-linked")
    "src/app/components/documents/documents-edit/documents-edit.component.ts" = @("app-documents-add-body","app-documents-add-footer","app-documents-add-header","documents-edit-info")
    "src/app/components/documents/documents-header/documents-filter/documents-filter.component.ts" = @("app-company-tags","app-multi-datepicker","app-tech-users-list-report","company-drop-down")
    "src/app/components/documents/documents-header/documents-header.component.ts" = @("documents-filter")
    "src/app/components/documents/documents.component.ts" = @("documents-edit-category","documents-header","documents-table","documents-templates-info")
    "src/app/components/file-manager/file-manager-add-file/file-manager-add-file.component.ts" = @("app-file-manager-add-file-drag-drop","app-file-manager-add-file-tags","app-mat-error","app-preloader-ticket")
    "src/app/components/file-manager/file-manager-all-customer-company/file-manager-all-customer-company.component.ts" = @("app-file-manager-file-info","app-file-manager-header")
    "src/app/components/file-manager/file-manager-all-customer/file-manager-all-customer.component.ts" = @("app-file-manager-file-info","app-file-manager-header","app-file-manager-item-category")
    "src/app/components/file-manager/file-manager-category/file-manager-category.component.ts" = @("app-file-manager-file-info","app-file-manager-header")
    "src/app/components/file-manager/file-manager-file-info/file-manager-file-info-tags/file-manager-file-info-tags.component.ts" = @("app-mat-chip","app-mat-chip-list","app-mat-form-field")
    "src/app/components/file-manager/file-manager-file-info/file-manager-file-info.component.ts" = @("app-file-manager-file-info-tags","app-mat-error")
    "src/app/components/file-manager/file-manager.component.ts" = @("app-file-manager-file-info","app-file-manager-header")
    "src/app/components/inventory/inventory-add-category/inventory-add-category.component.ts" = @("app-mat-error")
    "src/app/components/inventory/inventory-header/inventory-filter/inventory-filter.component.ts" = @("app-drop-down","inventory-add-category")
    "src/app/components/inventory/inventory-header/inventory-header.component.ts" = @("inventory-filter")
    "src/app/components/inventory/inventory-table/inventory-table.component.ts" = @("app-drop-down","app-mat-error","app-taxes")
    "src/app/components/inventory/inventory.component.ts" = @("app-contracts-edit","app-inventory-table","inventory-header")
    "src/app/components/marketing/marketing.component.ts" = @("app-users-filter","app-users-header","app-users-table")
    "src/app/components/password-manager/password-manager.component.ts" = @("app-passwoord-manager-filters","app-passwoord-manager-header","app-password-manager-add-aside","app-password-manager-edit-aside","app-password-manager-table")
    "src/app/components/reports/item-report/item-report.component.ts" = @("app-accounting-report","app-accounts-receivable","app-customer-sales-report","app-gl-number","app-product-sales-report","app-service-report","app-taxes-report","app-tech-service-report","app-ticket-report","applicationbycompany-report","common-commissions-report","detailed-commissions-report","detailed-contract-report","device-ip-summary-device-report","device-ip-summary-report","hardware-summary-device-report","hardware-summary-report","network-adapter-report","network-detail-report","network-ip-report","payments-report","remote-connection-report","report-device-antivirus","report-device-deploymentwarranty","report-device-diskspace","report-device-processorram","report-device-summary","report-device-warranty","software-summary-report","software-summary-report1","tech-sales-report","tech-ticket-report")
    "src/app/components/reports/report-additional-actions/report-send-email/report-send-email.component.ts" = @("app-mat-error","app-preloader-ticket","draft-email-user-recipients")
    "src/app/components/reports/reports/accounting-report/accounting-report.component.ts" = @("app-report-menu")
    "src/app/components/reports/reports/accounts-receivable/accounts-receivable.component.ts" = @("app-report-menu")
    "src/app/components/reports/reports/applicationbycompany-report/applicationbycompany-report.component.ts" = @("app-drop-down","app-report-send-email")
    "src/app/components/reports/reports/common-commissions-report/common-commissions-report.component.ts" = @("app-report-menu","ngx-charts-pie-chart")
    "src/app/components/reports/reports/customer-sales-report/customer-sales-report.component.ts" = @("app-overview-report","app-report-menu")
    "src/app/components/reports/reports/detailed-commissions-report/detailed-commissions-report.component.ts" = @("app-report-menu")
    "src/app/components/reports/reports/detailed-contract-report/detailed-contract-report.component.ts" = @("app-report-menu")
    "src/app/components/reports/reports/device-ip-summary-device-report/device-ip-summary-device-report.component.ts" = @("app-drop-down","app-report-send-email")
    "src/app/components/reports/reports/device-ip-summary-report/device-ip-summary-report.component.ts" = @("app-report-menu")
    "src/app/components/reports/reports/gl-number/gl-number.component.ts" = @("app-overview-report","app-report-menu")
    "src/app/components/reports/reports/hardware-summary-device-report/hardware-summary-device-report.component.ts" = @("app-drop-down","app-report-send-email")
    "src/app/components/reports/reports/hardware-summary-report/hardware-summary-report.component.ts" = @("app-report-menu")
    "src/app/components/reports/reports/network-adapter-report/network-adapter-report.component.ts" = @("app-drop-down","app-report-send-email")
    "src/app/components/reports/reports/network-detail-report/network-detail-report.component.ts" = @("app-drop-down","app-report-send-email")
    "src/app/components/reports/reports/network-ip-report/network-ip-report.component.ts" = @("app-drop-down","app-report-send-email")
    "src/app/components/reports/reports/payments-report/payments-report.component.ts" = @("app-report-menu")
    "src/app/components/reports/reports/product-sales-report/product-sales-report.component.ts" = @("app-overview-report","app-report-menu")
    "src/app/components/reports/reports/remote-connection-report/remote-connection-report.component.ts" = @("app-report-menu")
    "src/app/components/reports/reports/report-device-antivirus/report-device-antivirus.component.ts" = @("app-drop-down","app-report-send-email")
    "src/app/components/reports/reports/report-device-deploymentwarranty/report-device-deploymentwarranty.component.ts" = @("app-drop-down","app-report-send-email")
    "src/app/components/reports/reports/report-device-diskspace/report-device-diskspace.component.ts" = @("app-drop-down","app-report-send-email")
    "src/app/components/reports/reports/report-device-processorram/report-device-processorram.component.ts" = @("app-drop-down","app-report-send-email")
    "src/app/components/reports/reports/report-device-summary/report-device-summary.component.ts" = @("app-drop-down","app-report-send-email")
    "src/app/components/reports/reports/report-device-warranty/report-device-warranty.component.ts" = @("app-drop-down","app-report-send-email")
    "src/app/components/reports/reports/service-report/service-report.component.ts" = @("app-report-menu","ngx-charts-pie-chart")
    "src/app/components/reports/reports/software-summary-report/software-summary-report.component.ts" = @("app-report-menu")
    "src/app/components/reports/reports/software-summary-report1/software-summary-report1.component.ts" = @("app-drop-down","app-report-send-email")
    "src/app/components/reports/reports/taxes-report/taxes-report.component.ts" = @("app-overview-report","app-report-menu")
    "src/app/components/reports/reports/tech-sales-report/tech-sales-report.component.ts" = @("app-report-menu")
    "src/app/components/reports/reports/tech-service-report/tech-service-report.component.ts" = @("app-report-menu")
    "src/app/components/reports/reports/tech-ticket-report/tech-ticket-report.component.ts" = @("app-report-menu")
    "src/app/components/reports/reports/ticket-report/ticket-report.component.ts" = @("app-report-menu")
    "src/app/components/setting/accounting/accounting-settings.component.ts" = @("accounting-year","app-gl-number-settings","app-invoice-settings","app-quotes-settings","app-taxes-settings","custom-notes-settings","taxes-add")
    "src/app/components/setting/accounting/custom-notes-settings/add-custom-notes-settings/add-custom-notes-settings.component.ts" = @("app-mat-error")
    "src/app/components/setting/accounting/custom-notes-settings/custom-notes-settings.component.ts" = @("add-custom-notes-settings","app-dynamic-tooltip","edit-custom-notes-settings")
    "src/app/components/setting/accounting/custom-notes-settings/edit-custom-notes-settings/edit-custom-notes-settings.component.ts" = @("app-mat-error")
    "src/app/components/setting/accounting/gl-number/add-gl-number/add-gl-number.component.ts" = @("app-mat-error")
    "src/app/components/setting/accounting/gl-number/gl-number.component.ts" = @("add-gl-number","app-dynamic-tooltip","app-mat-error")
    "src/app/components/setting/accounting/invoice-settings/invoice-settings.component.ts" = @("app-drop-down")
    "src/app/components/setting/accounting/quotes-settings/quotes-settings.component.ts" = @("app-drop-down")
    "src/app/components/setting/accounting/taxes/taxes.component.ts" = @("app-dynamic-tooltip")
    "src/app/components/setting/company-profile/company-profile-api-keys/company-profile-api-keys-add-aside/company-profile-api-keys-add-aside.component.ts" = @("app-mat-error","app-preloader-ticket")
    "src/app/components/setting/company-profile/company-profile-api-keys/company-profile-api-keys-edit-aside/company-profile-api-keys-edit-aside.component.ts" = @("app-mat-error","app-preloader-ticket")
    "src/app/components/setting/company-profile/company-profile-operational-hours/company-profile-operational-hours.component.ts" = @("app-drop-down")
    "src/app/components/setting/company-profile/company-profile-profile/company-profile-profile.component.ts" = @("app-company-time-zone","app-drop-down")
    "src/app/components/setting/company-profile/company-profile-workspace/company-profile-workspace.component.ts" = @("app-mat-error")
    "src/app/components/setting/company-profile/company-profile.component.ts" = @("app-company-profile-api-keys","app-company-profile-api-keys-add-aside","app-company-profile-api-keys-edit-aside","app-company-profile-operational-hours","app-company-profile-profile","app-company-profile-workspace")
    "src/app/components/setting/email-template/email-template.component.ts" = @("app-dynamic-tooltip")
    "src/app/components/setting/manage-tags/manage-tags-add/manage-tags-add.component.ts" = @("app-mat-error")
    "src/app/components/setting/manage-tags/manage-tags-devices/manage-tags-devices.component.ts" = @("app-dynamic-tooltip","app-manage-tags-devices-add")
    "src/app/components/setting/manage-tags/manage-tags-files/manage-tags-files.component.ts" = @("app-dynamic-tooltip","app-mat-error","manage-tags-add")
    "src/app/components/setting/manage-tags/manage-tags.component.ts" = @("app-dynamic-tooltip","app-manage-tags-devices","app-manage-tags-files","manage-tags-add")
    "src/app/components/setting/marketing-email/marketing-email-users/marketing-email-users-add/marketing-email-users-add.component.ts" = @("app-preloader-ticket","marketing-email-users-add-item")
    "src/app/components/setting/marketing-email/marketing-email-users/marketing-email-users-item/marketing-email-users-item.component.ts" = @("app-dynamic-tooltip")
    "src/app/components/setting/marketing-email/marketing-email-users/marketing-email-users.component.ts" = @("marketing-email-users-add","marketing-email-users-item")
    "src/app/components/setting/marketing-email/marketing-email.component.ts" = @("app-dynamic-tooltip","marketing-email-users","marketing-subscription-type")
    "src/app/components/setting/marketing-email/marketing-subscription-type/marketing-subscription-type.component.ts" = @("add-marketing-subscription-type","app-dynamic-tooltip","app-mat-error")
    "src/app/components/setting/my-profile/account/account.component.ts" = @("app-drop-down")
    "src/app/components/setting/my-profile/activity-history/activity-history.component.ts" = @("agm-map","agm-marker")
    "src/app/components/setting/my-profile/my-profile.component.ts" = @("app-account","app-activity-history","app-email-notifications","app-profile","signature","tickets-my-profile")
    "src/app/components/setting/my-profile/profile/profile.component.ts" = @("app-drop-down")
    "src/app/components/setting/my-profile/signature/signature.component.ts" = @("add-signature","edit-signature")
    "src/app/components/setting/my-profile/tickets-my-profile/tickets-my-profile.component.ts" = @("app-drop-down")
    "src/app/components/setting/tech-users-settings/permission-manage/permission-manage.component.ts" = @("app-drop-down","app-dynamic-tooltip")
    "src/app/components/setting/tech-users-settings/tech-users-reassign/tech-users-reassign.component.ts" = @("app-drop-down")
    "src/app/components/setting/tech-users-settings/tech-users-settings.component.ts" = @("app-drop-down","app-dynamic-tooltip","app-permission-manage","app-preloader-ticket")
    "src/app/components/shared/confirm/confirm.component.ts" = @("app-preloader-ticket")
    "src/app/components/shared/draft-email/draft-email.component.ts" = @("app-draft-email-recipients","app-mat-error","app-preloader-ticket","app-upload-area","draft-email-user-recipients")
    "src/app/components/shared/google-authenticator/google-authenticator.component.ts" = @("app-mat-error")
    "src/app/components/shared/map-modal/map-modal.component.ts" = @("agm-map","agm-marker")
    "src/app/components/shared/tags/tags.component.ts" = @("app-mat-chip","app-mat-chip-list","app-mat-form-field")
    "src/app/components/super-admin-public/super-admin-public-category/super-admin-public-category.component.ts" = @("super-admin-public-detail")
    "src/app/components/super-admin-public/super-admin-public-detail/super-admin-public-detail.component.ts" = @("super-admin-public-header")
    "src/app/components/super-admin-public/super-admin-public-header/super-admin-public-header.component.ts" = @("super-admin-public-search")
    "src/app/components/super-admin-public/super-admin-public-list/super-admin-public-list.component.ts" = @("app-super-admin-knowledge-base-news")
    "src/app/components/super-admin-public/super-admin-public.component.ts" = @("super-admin-public-header")
    "src/app/components/super-admin/left-panel-super-admin-categories/left-panel-super-admin-categories-actions/left-panel-super-admin-categories-actions.component.ts" = @("app-dynamic-tooltip")
    "src/app/components/super-admin/left-panel-super-admin-categories/left-panel-super-admin-categories.component.ts" = @("app-dynamic-tooltip","left-panel-super-admin-categories-actions")
    "src/app/components/super-admin/super-admin-companies/super-admin-companies.component.ts" = @("left-panel-super-admin-companies","super-admin-companies-header","super-admin-companies-item")
    "src/app/components/super-admin/super-admin-knowledge-base/super-admin-knowledge-base-add/super-admin-knowledge-base-add.component.ts" = @("app-drop-down","app-mat-error","app-preloader-ticket")
    "src/app/components/super-admin/super-admin-knowledge-base/super-admin-knowledge-base-edit/super-admin-knowledge-base-edit.component.ts" = @("app-drop-down","app-mat-error","app-preloader-ticket")
    "src/app/components/super-admin/super-admin-knowledge-base/super-admin-knowledge-base-news-list/super-admin-knowledge-base-news-list.component.ts" = @("app-super-admin-knowledge-base-news")
    "src/app/components/super-admin/super-admin-knowledge-base/super-admin-knowledge-base-table/super-admin-knowledge-base-table.component.ts" = @("app-super-admin-knowledge-base-add","app-super-admin-knowledge-base-edit","app-super-admin-knowledge-base-news-list","app-super-admin-knowledge-base-table-item")
    "src/app/components/super-admin/super-admin-knowledge-base/super-admin-knowledge-base.component.ts" = @("app-super-admin-knowledge-base-table")
    "src/app/components/super-admin/support-page/support-page-category/support-page-category.component.ts" = @("support-page-body","support-page-header","support-page-info")
    "src/app/components/super-admin/support-page/support-page-header/support-page-header.component.ts" = @("app-dynamic-tooltip","support-page-breadcrumbs")
    "src/app/components/super-admin/support-page/support-page-info/support-page-info-tags/support-page-info-tags.component.ts" = @("app-dynamic-tooltip")
    "src/app/components/super-admin/support-page/support-page-info/support-page-info.component.ts" = @("support-page-info-tags")
    "src/app/components/super-admin/support-page/support-page.component.ts" = @("left-panel-super-admin-categories","support-page-help-center")
    "src/app/components/tasks-dashboard/tasks-dashboard-my-calendar/tasks-dashboard-my-calendar.component.ts" = @("app-tasks-dashboard-my-calendar-item")
    "src/app/components/tasks-dashboard/tasks-dashboard-my-tasks-list/tasks-dashboard-my-tasks-list.component.ts" = @("app-tasks-list-item")
    "src/app/components/tasks-dashboard/tasks-dashboard-my-tasks/tasks-dashboard-my-tasks.component.ts" = @("app-tasks-dashboard-my-tasks-list")
    "src/app/components/tasks-dashboard/tasks-dashboard.component.ts" = @("app-tasks-dashboard-my-calendar","app-tasks-dashboard-my-tasks","app-tasks-dashboard-stats")
    "src/app/components/tasks/tasks-add/tasks-add.component.ts" = @("angular-editor","app-date-picker","app-drop-down","app-mat-error","app-preloader-ticket","app-services-list","app-tasks-add-assigned-users","app-tasks-add-associate-tickets","app-tasks-date-picker","app-upload-area-progress","company-drop-down")
    "src/app/components/tasks/tasks-calendar/tasks-calendar-month/tasks-calendar-month.component.ts" = @("app-task-header-add","app-tasks-calendar-month-item-week")
    "src/app/components/tasks/tasks-calendar/tasks-calendar-week/tasks-calendar-week.component.ts" = @("app-task-header-add","app-tasks-calendar-week-item-all-day","app-tasks-calendar-week-item-hour")
    "src/app/components/tasks/tasks-calendar/tasks-calendar.component.ts" = @("app-tasks-calendar-month","app-tasks-calendar-week")
    "src/app/components/tasks/tasks-edit/tasks-edit.component.ts" = @("angular-editor","app-date-picker","app-drop-down","app-mat-error","app-preloader-ticket","app-services-list","app-tasks-add-assigned-users","app-tasks-add-associate-tickets","app-tasks-date-picker","app-upload-area-progress","company-drop-down")
    "src/app/components/tasks/tasks-list/tasks-list.component.ts" = @("app-tasks-list-item")
    "src/app/components/tasks/tasks-tabs/tasks-tabs.component.ts" = @("app-tasks-calendar","app-tasks-list")
    "src/app/components/tasks/tasks.component.ts" = @("app-tasks-header","app-tasks-tabs")
    "src/app/components/tickets/recurring-tickets/recurring-tickets-add-aside/recurring-tickets-add-aside.component.ts" = @("app-assigned-ticket-user","app-date-picker","app-devices-recurring-tickets","app-duration","app-interval","app-mat-error","app-product-list","app-services-list","app-tags","company-drop-down")
    "src/app/components/tickets/recurring-tickets/recurring-tickets-edit-aside/recurring-tickets-edit-aside.component.ts" = @("app-assigned-ticket-user","app-date-picker","app-devices-recurring-tickets","app-duration","app-interval","app-mat-error","app-product-list","app-services-list","app-tags","company-drop-down")
    "src/app/components/tickets/recurring-tickets/recurring-tickets-table/recurring-tickets-table.component.ts" = @("app-recurring-tickets-table-assigned-user-more")
    "src/app/components/tickets/recurring-tickets/recurring-tickets.component.ts" = @("app-recurring-tickets-add-aside","app-recurring-tickets-edit-aside","app-recurring-tickets-header","app-recurring-tickets-table")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-add-assigned-user/ticket-detail-add-assigned-user.component.ts" = @("app-add-assigned-user")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-change-company/ticket-detail-change-company.component.ts" = @("app-drop-down","app-dynamic-tooltip","company-drop-down")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-change-priority/ticket-detail-change-priority.component.ts" = @("app-mat-error")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-change-status/ticket-detail-change-status.component.ts" = @("app-drop-down")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-contact-details/ticket-detail-contact-details.component.ts" = @("preview-phone-mask","ticket-detail-contact-details-history")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-contact/ticket-detail-contact.component.ts" = @("preview-phone-mask")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-devices/ticket-detail-devices-details/ticket-detail-devices-details.component.ts" = @("ticket-detail-devices-item")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-devices/ticket-detail-devices.component.ts" = @("ticket-detail-devices-item")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-edit-tags/ticket-detail-edit-tags.component.ts" = @("app-mat-chip","app-mat-chip-list","app-mat-form-field")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-header/ticket-detail-header.component.ts" = @("app-preloader-ticket")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-message/ticket-detail-message.component.ts" = @("app-preloader-ticket")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-note-modal/ticket-detail-note-modal.component.ts" = @("app-preloader-ticket","ticket-detail-profile-form-update-header","ticket-detail-profile-form-update-note","ticket-profile-form-update-note-list")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-passwords/ticket-detail-passwords-details/ticket-detail-passwords-details.component.ts" = @("ticket-detail-passwords-item")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-passwords/ticket-detail-passwords-item/ticket-detail-passwords-item.component.ts" = @("app-dynamic-tooltip","app-upload-area-progress")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-passwords/ticket-detail-passwords.component.ts" = @("ticket-detail-passwords-item")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-profile-edit-updates/ticket-detail-profile-edit-updates-products/ticket-detail-profile-edit-updates-products.component.ts" = @("app-invoice-form-ticket-edit-taxes","app-mat-error","app-product-list")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-profile-edit-updates/ticket-detail-profile-edit-updates-services/ticket-detail-profile-edit-updates-services.component.ts" = @("app-date-picker","app-services-list","app-ticket-profile-updates-service-duration","app-ticket-profile-updates-service-timepicker")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-profile-edit-updates/ticket-detail-profile-edit-updates.component.ts" = @("app-preloader-ticket","ticket-detail-profile-edit-updates-header","ticket-detail-profile-edit-updates-products","ticket-detail-profile-edit-updates-services")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-profile-form-update/ticket-detail-profile-form-update-note/ticket-detail-profile-form-update-note.component.ts" = @("app-upload-area-progress")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-profile-form-update/ticket-detail-profile-form-update-products/ticket-detail-profile-form-update-products.component.ts" = @("app-invoice-form-ticket-edit-taxes","app-mat-error","app-product-list")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-profile-form-update/ticket-detail-profile-form-update-services/ticket-detail-profile-form-update-services.component.ts" = @("app-date-picker","app-mat-error","app-ticket-profile-updates-service-duration","app-ticket-profile-updates-service-timepicker")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-profile-form-update/ticket-detail-profile-form-update-support/ticket-detail-profile-form-update-support.component.ts" = @("app-dynamic-tooltip")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-profile-form-update/ticket-detail-profile-form-update.component.ts" = @("app-preloader-ticket","ticket-detail-profile-form-update-header","ticket-detail-profile-form-update-note","ticket-detail-profile-form-update-products","ticket-detail-profile-form-update-services","ticket-detail-profile-form-update-support","ticket-profile-form-update-note-list")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-profile-updates/ticket-detail-profile-updates-note/ticket-detail-profile-updates-note-item/ticket-detail-profile-updates-note-item.component.ts" = @("ticket-detail-profile-updates-note-edit","ticket-detail-profile-updates-note-info")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-profile-updates/ticket-detail-profile-updates-note/ticket-detail-profile-updates-note.component.ts" = @("app-dynamic-tooltip","ticket-detail-profile-updates-header-info","ticket-detail-profile-updates-note-item")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-profile-updates/ticket-detail-profile-updates-product/ticket-detail-profile-updates-product-edit/ticket-detail-profile-updates-product-edit.component.ts" = @("app-mat-error","app-product-list")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-profile-updates/ticket-detail-profile-updates-product/ticket-detail-profile-updates-product-info/ticket-detail-profile-updates-product-info.component.ts" = @("app-date-picker","app-dynamic-tooltip","app-tech-users")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-profile-updates/ticket-detail-profile-updates-product/ticket-detail-profile-updates-product-item/ticket-detail-profile-updates-product-item.component.ts" = @("ticket-detail-profile-updates-product-edit","ticket-detail-profile-updates-product-info")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-profile-updates/ticket-detail-profile-updates-product/ticket-detail-profile-updates-product.component.ts" = @("app-dynamic-tooltip","ticket-detail-profile-updates-product-header-info","ticket-detail-profile-updates-product-item")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-profile-updates/ticket-detail-profile-updates-service/ticket-detail-profile-updates-service-info/ticket-detail-profile-updates-service-info.component.ts" = @("app-date-picker","app-dynamic-tooltip","app-tech-users")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-profile-updates/ticket-detail-profile-updates-service/ticket-detail-profile-updates-service-item/ticket-detail-profile-updates-service-item.component.ts" = @("ticket-detail-profile-updates-service-info")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-profile-updates/ticket-detail-profile-updates-service/ticket-detail-profile-updates-service.component.ts" = @("app-dynamic-tooltip","ticket-detail-profile-updates-service-header-info","ticket-detail-profile-updates-service-item")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-profile-updates/ticket-detail-profile-updates.component.ts" = @("ticket-detail-profile-updates-note","ticket-detail-profile-updates-product","ticket-detail-profile-updates-service")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-tasks/ticket-detail-tasks-item/ticket-detail-tasks-item.component.ts" = @("app-dynamic-tooltip","app-task-header-add-type","app-tasks-date-picker","app-tech-users")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-tasks/ticket-detail-tasks.component.ts" = @("app-task-header-add-type","app-tasks-date-picker","app-tech-users","app-ticket-detail-tasks-item")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-tickets/ticket-detail-tickets-details/ticket-detail-tickets-details.component.ts" = @("ticket-detail-tickets-status")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail-tickets/ticket-detail-tickets.component.ts" = @("ticket-detail-tickets-status")
    "src/app/components/tickets/tickets/ticket-detail/ticket-detail.component.ts" = @("app-ticket-detail-total-statistics","company-users-drop-down","ticket-detail-add-assigned-user","ticket-detail-attachments","ticket-detail-change-company","ticket-detail-change-priority","ticket-detail-change-status","ticket-detail-claim-info","ticket-detail-contact","ticket-detail-contact-details","ticket-detail-devices","ticket-detail-devices-details","ticket-detail-documents","ticket-detail-documents-details","ticket-detail-documents-preview","ticket-detail-edit-tags","ticket-detail-header","ticket-detail-info-status","ticket-detail-linked-agents","ticket-detail-message","ticket-detail-passwords","ticket-detail-passwords-details","ticket-detail-profile-edit-updates","ticket-detail-profile-form-update","ticket-detail-profile-updates","ticket-detail-tasks","ticket-detail-tickets","ticket-detail-tickets-details")
    "src/app/components/tickets/tickets/tickets-header/tickets-filter/tickets-filter-created-drop-down/tickets-filter-created-drop-down.component.ts" = @("app-mat-error","ngb-datepicker")
    "src/app/components/tickets/tickets/tickets-header/tickets-filter/tickets-filter-drop-down/tickets-filter-drop-down.component.ts" = @("app-dynamic-tooltip","app-mat-chip","app-mat-chip-list","app-mat-form-field")
    "src/app/components/tickets/tickets/tickets-header/tickets-filter/tickets-filter.component.ts" = @("app-tickets-filter-tags","tickets-filter-companies-drop-down","tickets-filter-created-drop-down","tickets-filter-drop-down","tickets-filter-search","tickets-filter-status","tickets-filter-users-drop-down")
    "src/app/components/tickets/tickets/tickets-header/tickets-header.component.ts" = @("app-mat-chip","app-mat-chip-list","app-mat-form-field","tickets-filter-info")
    "src/app/components/tickets/tickets/tickets-table/tickets-table.component.ts" = @("app-tickets-filter","app-tickets-table-item")
    "src/app/components/tickets/tickets/tickets.component.ts" = @("app-merge-tickets","app-tickets-header","app-tickets-table")
    "src/app/components/users-details/users-details-left-panel/users-details-left-panel.component.ts" = @("app-company-tags","app-dynamic-tooltip","app-mat-error","user-custom-subscription")
    "src/app/components/users-details/users-details-tab-companies/users-details-tab-companies-add/users-details-tab-companies-add.component.ts" = @("app-drop-down","app-preloader-ticket","company-drop-down","preview-phone-mask","user-table-default-subscription")
    "src/app/components/users-details/users-details-tab-companies/users-details-tab-companies-item/users-details-tab-companies-item.component.ts" = @("app-drop-down","app-dynamic-tooltip","preview-phone-mask","user-table-default-subscription")
    "src/app/components/users-details/users-details-tab-companies/users-details-tab-companies.component.ts" = @("app-users-details-tab-companies-add","app-users-details-tab-companies-item")
    "src/app/components/users-details/users-details.component.ts" = @("app-users-details-header","app-users-details-left-panel","app-users-details-tab-companies","app-users-details-tab-documents","app-users-details-tab-messages","app-users-details-tab-passwords","app-users-details-tab-tickets")
    "src/app/components/users/add-user-to-company/add-user-to-company.component.ts" = @("app-add-user-to-company-item","app-add-user-to-company-selected-item","app-preloader-ticket")
    "src/app/components/users/users-aside-edit/users-aside-edit.component.ts" = @("app-company-tags","app-drop-down","app-dynamic-tooltip","app-mat-error","app-preloader-ticket","company-drop-down","user-custom-subscription","user-default-subscription")
    "src/app/components/users/users-aside/users-aside.component.ts" = @("app-company-tags","app-drop-down","app-dynamic-tooltip","app-mat-error","app-preloader-ticket","company-drop-down","user-custom-subscription","user-default-subscription")
    "src/app/components/users/users-header/users-filter/users-filter-custom-subscriptions/users-filter-custom-subscriptions.component.ts" = @("app-dynamic-tooltip","app-mat-chip","app-mat-chip-list","app-mat-form-field")
    "src/app/components/users/users-header/users-filter/users-filter-default-subscription/users-filter-default-subscription.component.ts" = @("app-mat-chip","app-mat-chip-list","app-mat-form-field")
    "src/app/components/users/users-header/users-filter/users-filter-subscriptions/users-filter-subscriptions.component.ts" = @("app-mat-chip","app-mat-chip-list","app-mat-form-field")
    "src/app/components/users/users-header/users-filter/users-filter-tags/users-filter-tags.component.ts" = @("app-dynamic-tooltip","app-mat-chip","app-mat-chip-list","app-mat-form-field")
    "src/app/components/users/users-header/users-filter/users-filter.component.ts" = @("app-users-filter-custom-subscriptions","app-users-filter-default-subscription","app-users-filter-job-title","app-users-filter-tags","tickets-filter-companies-drop-down")
    "src/app/components/users/users-header/users-header.component.ts" = @("app-users-filter-info")
    "src/app/components/users/users-table/users-table.component.ts" = @("app-dynamic-tooltip","preview-phone-mask","user-table-custom-subscription","user-table-default-subscription")
    "src/app/components/users/users.component.ts" = @("app-users-filter","app-users-header","app-users-table")
    "src/app/services/modal/modal-lock-screen/modal-lock-screen.component.ts" = @("app-mat-error")
}

# ── STEP 3: Apply fixes ──────────────────────────────────────
$fixedCount = 0
$skippedSelectors = @()

foreach ($relPath in $missingMap.Keys) {
    $fullPath = Join-Path $projectRoot $relPath.Replace('/', '\')
    if (-not (Test-Path $fullPath)) {
        Write-Warning "NOT FOUND: $fullPath"
        continue
    }

    $content = Get-Content $fullPath -Raw -Encoding UTF8
    $changed = $false
    $newImportLines = @()
    $newClassNames = @()

    foreach ($selector in $missingMap[$relPath]) {
        if (-not $selectorMap.ContainsKey($selector)) {
            $skippedSelectors += "$selector (used in $relPath)"
            continue
        }

        $info = $selectorMap[$selector]
        $className = $info.class
        $childRelPath = $info.path

        # Skip if already imported
        if ($content -match "\b$className\b") { continue }

        # Calculate relative import path from parent to child
        $parentDir = [System.IO.Path]::GetDirectoryName($fullPath)
        $childFullPath = Join-Path $projectRoot $childRelPath.Replace('/', '\')
        $childDir = [System.IO.Path]::GetDirectoryName($childFullPath)
        $childFile = [System.IO.Path]::GetFileNameWithoutExtension($childFullPath) -replace '\.component$', '.component'

        # Build relative path
        $relImport = [System.IO.Path]::GetRelativePath($parentDir, $childFullPath) -replace '\\', '/'
        $relImport = $relImport -replace '\.ts$', ''
        if (-not $relImport.StartsWith('.')) { $relImport = "./$relImport" }

        $newImportLines += "import { $className } from '$relImport';"
        $newClassNames += $className
        $changed = $true
    }

    if ($changed) {
        # Add import statements at top
        $importBlock = ($newImportLines | Select-Object -Unique) -join "`n"
        $content = $importBlock + "`n" + $content

        # Add to imports array or create one
        $classBlock = ($newClassNames | Select-Object -Unique) -join ", "
        if ($content -match "imports\s*:\s*\[") {
            $content = $content -replace "imports\s*:\s*\[", "imports: [$classBlock, "
        } else {
            $content = $content -replace "(@Component\(\s*\{)", "`$1`n  standalone: true,`n  imports: [$classBlock],"
        }

        Set-Content $fullPath $content -Encoding UTF8 -NoNewline
        Write-Host "FIXED: $relPath (+$($newClassNames.Count) imports)" -ForegroundColor Green
        $fixedCount++
    }
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "Fixed : $fixedCount files" -ForegroundColor Green

if ($skippedSelectors.Count -gt 0) {
    Write-Host ""
    Write-Host "Selectors NOT found in project ($($skippedSelectors.Count)) - likely 3rd party libs:" -ForegroundColor Yellow
    $skippedSelectors | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
}

Write-Host ""
Write-Host "Next: ng build 2> build3.log" -ForegroundColor Cyan
