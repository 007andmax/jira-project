import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { PermissionsService } from "src/app/services/permissions/permissions.service";
import { UsersStateService } from "src/app/states/users/users-state.service";

@Injectable()
export class PermissionReportsService implements CanActivate {
    constructor(private permissionsService: PermissionsService, private usersStateService: UsersStateService) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        if (this.usersStateService.getCurrentUser()) {
            if (!(this.getPermissions("VIEW_SALES_REPORT") ||
                this.getPermissions("VIEW_FINANCIAL_REPORT") ||
                this.getPermissions("VIEW_PERFORMANCE_REPORT") ||
                this.getPermissions("VIEW_TICKET_REPORT") ||
                this.getPermissions("VIEW_REMOTE_ACCESS_REPORT") ||
                this.getPermissions("VIEW_TAXES_REPORT") ||
                this.getPermissions("VIEW_DEVICES_REPORTS"))) return false;
            if ((route.params.id === "byProducts" || route.params.id === "byCustomers" || route.params.id === "common-commissions" || route.params.id === "detailed-commissions" || route.params.id === "income-accounts") && this.getPermissions('VIEW_SALES_REPORT')) return true;
            if ((route.params.id === "accounts-receivable" || route.params.id === "accounting-report" || route.params.id === "payments-report") && this.getPermissions('VIEW_FINANCIAL_REPORT')) return true;
            if ((route.params.id === "tech-sales" || route.params.id === "tech-ticket" || route.params.id === "tech-service" || route.params.id === "ticket-report" || route.params.id === "service-report" || route.params.id === "block-time-report") && this.getPermissions('VIEW_TICKET_REPORT')) return true;
            if ((route.params.id === "remote-access") && this.getPermissions('VIEW_REMOTE_ACCESS_REPORT')) return true;
            if ((route.params.id === "byTaxes") && this.getPermissions('VIEW_TAXES_REPORT')) return true;
            if ((route.params.id === "software-summary" || route.params.id === "software-summary-device" || route.params.id === "report-device-summary" || route.params.id === "device-ip-summary" || route.params.id === "device-ip-summary-device" || route.params.id === "hardware-summary" || route.params.id === "hardware-summary-device" || route.params.id === "report-device-processorram" || route.params.id === "report-device-diskspace" || route.params.id === "network-ip-report" || route.params.id === "network-detail-report" || route.params.id === "network-adapter-report" || route.params.id === "report-device-antivirus" || route.params.id === "applicationbycompany-report" || route.params.id === "report-device-warranty" || route.params.id === "report-device-deploymentwarranty") && this.getPermissions('VIEW_DEVICES_REPORTS')) return true;

            return false;
        }
        return new Promise((resolve, reject) => {
            this.usersStateService.getOnGetCurrentuser().subscribe(data => {
                if (!(this.getPermissions("VIEW_SALES_REPORT") ||
                    this.getPermissions("VIEW_FINANCIAL_REPORT") ||
                    this.getPermissions("VIEW_PERFORMANCE_REPORT") ||
                    this.getPermissions("VIEW_TICKET_REPORT") ||
                    this.getPermissions("VIEW_REMOTE_ACCESS_REPORT") ||
                    this.getPermissions("VIEW_TAXES_REPORT") ||
                    this.getPermissions("VIEW_DEVICES_REPORTS"))) resolve(false);
                if ((route.params.id === "byProducts" || route.params.id === "byCustomers" || route.params.id === "common-commissions" || route.params.id === "detailed-commissions" || route.params.id === "income-accounts") && this.getPermissions('VIEW_SALES_REPORT')) resolve(true);
                if ((route.params.id === "accounts-receivable" || route.params.id === "accounting-report" || route.params.id === "payments-report") && this.getPermissions('VIEW_FINANCIAL_REPORT')) resolve(true);
                if ((route.params.id === "tech-sales" || route.params.id === "tech-ticket" || route.params.id === "tech-service" || route.params.id === "ticket-report" || route.params.id === "service-report" || route.params.id === "block-time-report") && this.getPermissions('VIEW_TICKET_REPORT')) resolve(true);
                if ((route.params.id === "remote-access") && this.getPermissions('VIEW_REMOTE_ACCESS_REPORT')) resolve(true);
                if ((route.params.id === "byTaxes") && this.getPermissions('VIEW_TAXES_REPORT')) resolve(true);
                if ((route.params.id === "software-summary" || route.params.id === "software-summary-device" || route.params.id === "report-device-summary" || route.params.id === "device-ip-summary" || route.params.id === "device-ip-summary-device" || route.params.id === "hardware-summary" || route.params.id === "hardware-summary-device" || route.params.id === "report-device-processorram" || route.params.id === "report-device-diskspace" || route.params.id === "network-ip-report" || route.params.id === "network-detail-report" || route.params.id === "network-adapter-report" || route.params.id === "report-device-antivirus" || route.params.id === "applicationbycompany-report" || route.params.id === "report-device-warranty" || route.params.id === "report-device-deploymentwarranty") && this.getPermissions('VIEW_DEVICES_REPORTS')) resolve(true);
                resolve(false);
            })
        });
    }
    public getPermissions(action) {
        return this.permissionsService.isAllowed(action)
    }

}
