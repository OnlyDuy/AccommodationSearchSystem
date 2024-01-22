import { AbpMultiTenancyService } from 'abp-ng2-module';
import { Injectable } from '@angular/core';
import {
    ApplicationInfoDto,
    GetCurrentLoginInformationsOutput,
    SessionServiceProxy,
    TenantLoginInfoDto,
    UserLoginInfoDto
} from '@shared/service-proxies/service-proxies';

@Injectable()
export class AppSessionService {

    private _user: UserLoginInfoDto;
    private _tenant: TenantLoginInfoDto;
    private _application: ApplicationInfoDto;

    constructor(
        private _sessionService: SessionServiceProxy,
        private _abpMultiTenancyService: AbpMultiTenancyService) {
    }

    get application(): ApplicationInfoDto {
        return this._application;
    }

    get user(): UserLoginInfoDto {
        return this._user;
    }

    get userId(): number {
        return this.user ? this.user.id : null;
    }

    get tenant(): TenantLoginInfoDto {
        return this._tenant;
    }

    get tenantId(): number {
        return this.tenant ? this.tenant.id : null;
    }

    getShownLoginId(): number {
        const id = this._user.id;
        if (!this._abpMultiTenancyService.isEnabled) {
            return id;
        }
        return id;

        // return parseInt((this._tenant ? this._tenant.id : '.') + '\\' + id);
    }


    getShownLoginName(): string {
        const userName = this._user.userName;
        if (!this._abpMultiTenancyService.isEnabled) {
            return userName;
        }

        return (this._tenant ? this._tenant.tenancyName : '.') + '\\' + userName;
    }

    getShownLoginSurname(): string {
        const surname = this._user.surname;
        if (!this._abpMultiTenancyService.isEnabled) {
            return surname;
        }

        return (this._tenant ? this._tenant.tenancyName : '.') + '\\' + surname;
    }

    getShownLoginEmail(): string {
        const emailAddress = this._user.emailAddress;
        if (!this._abpMultiTenancyService.isEnabled) {
            return emailAddress;
        }

        return (this._tenant ? this._tenant.tenancyName : '.') + '\\' + emailAddress;
    }

    getShownLoginPhoneNumber(): string {
        const phoneNumber = this._user.phoneNumber;
        if (!this._abpMultiTenancyService.isEnabled) {
            return phoneNumber;
        }

        return (this._tenant ? this._tenant.tenancyName : '.') + '\\' + phoneNumber;
    }

    init(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this._sessionService.getCurrentLoginInformations().toPromise().then((result: GetCurrentLoginInformationsOutput) => {
                this._application = result.application;
                this._user = result.user;
                this._tenant = result.tenant;

                resolve(true);
            }, (err) => {
                reject(err);
            });
        });
    }

    changeTenantIfNeeded(tenantId?: number): boolean {
        if (this.isCurrentTenant(tenantId)) {
            return false;
        }

        abp.multiTenancy.setTenantIdCookie(tenantId);
        location.reload();
        return true;
    }

    private isCurrentTenant(tenantId?: number) {
        if (!tenantId && this.tenant) {
            return false;
        } else if (tenantId && (!this.tenant || this.tenant.id !== tenantId)) {
            return false;
        }

        return true;
    }
}
