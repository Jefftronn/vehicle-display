import { Driver } from "./driver.model";
import { RaceTeam } from "./race-team.model";

export interface DriversChampionship {
    classificationId: number;
    driverId: string;
    teamId: string;
    points: number;
    position: number;
    wins: number;
    driver: Driver;
    team: RaceTeam;
} 