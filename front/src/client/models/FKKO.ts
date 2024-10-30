/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Adds nested create feature
 */
export type FKKO = {
    readonly id: number;
    readonly created_at: string;
    readonly updated_at: string;
    code: string;
    name: string;
    security_class?: string;
    price: number;
    company: number;
    contract?: number | null;
};
