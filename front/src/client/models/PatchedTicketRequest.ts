/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TicketStatusEnum } from './TicketStatusEnum';

export type PatchedTicketRequest = {
    landfill_id?: number;
    company_id?: number;
    fkko_id?: number;
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
};
