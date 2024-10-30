/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FKKO } from './FKKO';

/**
 * Adds nested create feature
 */
export type CompanyShort = {
    readonly id: number;
    name: string;
    fkko?: Array<FKKO>;
    contract_num?: string | null;
    contract_date?: string | null;
};
