/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Company } from './Company';

export type PaginatedCompanyList = {
    count?: number;
    next?: string | null;
    previous?: string | null;
    results?: Array<Company>;
};
