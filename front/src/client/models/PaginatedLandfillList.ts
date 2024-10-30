/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Landfill } from './Landfill';

export type PaginatedLandfillList = {
    count?: number;
    next?: string | null;
    previous?: string | null;
    results?: Array<Landfill>;
};
