/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { NonComplianceReport } from './NonComplianceReport';

export type PaginatedNonComplianceReportList = {
    count?: number;
    next?: string | null;
    previous?: string | null;
    results?: Array<NonComplianceReport>;
};
