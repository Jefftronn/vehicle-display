import { DriversChampionship } from "./drivers-championship.model";

export interface StatsResponse {
    season: number;
    championshipId: number;
    drivers_championship: DriversChampionship[];
}