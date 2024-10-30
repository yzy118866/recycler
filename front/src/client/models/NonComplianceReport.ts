/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Ticket } from './Ticket';
import type { UserShort } from './UserShort';

export type NonComplianceReport = {
    readonly id: number;
    readonly ticket: Ticket;
    readonly author: UserShort;
    readonly created_at: string;
    readonly updated_at: string;
    car_model?: string;
    car_num?: string;
    car_driver?: string;
    description?: string;
};
