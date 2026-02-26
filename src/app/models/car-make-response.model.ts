import { CarMake } from "./car-make.model";

export interface CarMakeResponse {
  Count: number;
  Message: string;
  SearchCriteria: string;
  Results: CarMake[];
}