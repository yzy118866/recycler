/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CompanyShort } from './CompanyShort';
import type { FKKO } from './FKKO';
import type { Landfill } from './Landfill';
import type { TicketStatusEnum } from './TicketStatusEnum';
import type { UserShort } from './UserShort';

export type Ticket = {
    readonly id: number;
    readonly company: CompanyShort;
    readonly landfill: Landfill;
    readonly fkko: FKKO;
    readonly author: UserShort;
    readonly report_sent: string;
    readonly price_actual: string;
    readonly created_at: string;
    readonly updated_at: string;
    car_num?: string;
    mass_full?: number | null;
    mass_empty?: number | null;
    num?: string | null;
    car_model?: string;
    status?: TicketStatusEnum;
    approve_status?: boolean | null;
    ticket_volume?: string | null;
    actual_volume?: string | null;
    short_name?: string | null;
    readonly waste_image: string | null;
};
