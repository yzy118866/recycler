/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FKKORequest } from './FKKORequest';

/**
 * Adds nested create feature
 */
export type CompanyShortRequest = {
    name: string;
    fkko?: Array<FKKORequest>;
    contract_num?: string | null;
    contract_date?: string | null;
};
