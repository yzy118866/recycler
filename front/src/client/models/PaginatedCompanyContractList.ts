/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CompanyContract } from './CompanyContract';

export type PaginatedCompanyContractList = {
    count?: number;
    next?: string | null;
    previous?: string | null;
    results?: Array<CompanyContract>;
};
