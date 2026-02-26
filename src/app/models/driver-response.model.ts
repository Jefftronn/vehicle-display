import { Driver } from "./driver.model";

export interface DriverResponse {
    total: number;
    season: string;
    drivers: Driver[];
}