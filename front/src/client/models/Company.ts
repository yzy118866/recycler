/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CompanyContract } from './CompanyContract';
import type { CompanyStatusEnum } from './CompanyStatusEnum';
import type { FKKO } from './FKKO';
import type { Landfill } from './Landfill';
import type { TicketTemplate } from './TicketTemplate';
import type { UserShort } from './UserShort';

/**
 * Adds nested create feature
 */
export type Company = {
    readonly id: number;
    readonly author: UserShort;
    readonly contracts: Array<CompanyContract>;
    fkko?: Array<FKKO>;
    ticket_template?: TicketTemplate;
    readonly landfill: Landfill;
    readonly created_at: string;
    readonly updated_at: string;
    name: string;
    readonly status: CompanyStatusEnum;
    customer?: number | null;
    contract_num?: string | null;
    contract_date?: string | null;
    sum_actual?: number | null;
    sum_overall?: number | null;
    kpts?: string | null;
};
