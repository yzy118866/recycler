/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Ticket } from './Ticket';

export type PaginatedTicketList = {
    count?: number;
    next?: string | null;
    previous?: string | null;
    results?: Array<Ticket>;
};
