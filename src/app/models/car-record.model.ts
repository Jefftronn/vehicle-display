export interface CarRecord {
  meta: Meta;
  entities: Entities;
}

export interface Entities {
  vehicles: EntitiesVehicles;
}

export interface EntitiesVehicles {
  automobiles: Automobile[];
}

export interface Automobile {
  vin: string;
  vin_prefix: string;
  license_plate: string;
  license_plate_state: string;
  make: string;
  model: string;
  year: number;
  class: string;
  body_style: string;
  images: Image[];
  prices: Prices;
  lease: null;
  meta: null;
  nmvtis_success: boolean;
  clean: null;
  category: string;
  size: string;
  type: string;
  mileage: Mileage;
  estimated_mileage: Mileage;
  specs: Specs;
  design: Design;
  origin: Origin;
  equipments: null;
  options: null;
  recalls: Recall[];
  warranties: Warranty[];
  ownership_costs: OwnershipCosts;
  ownership_history: OwnershipHistory[];
  accidents: Accident[];
  sales: Sale[];
  salvage: Salvage[];
  thefts: Theft[];
  title_registrations: TitleRegistration[];
  title_checks: TitleCheck[];
  safety_ratings: null;
  auctions: Auction[];
  exports: Export[];
  impounds: Impound[];
  liens: Lien[];
  maintenance_schedule: null;
  repair_costs: null;
  damage_history: null;
}

export interface Accident {
  airbags_deployed: null;
  crash_location: string;
  crash_severity: string;
  damage_severity: string;
  date: DateClass;
  estimated_damage: number;
  estimated_speed: string;
  impact_area: string;
  insurance_company: string;
  license_state: string;
  manner_of_collision: string;
  object_struck: string;
  posted_speed: string;
  report_id: string;
  reporting_agency: string;
  type: string;
  source: Source;
  vehicle: Vehicle;
}

export interface DateClass {
  full: string;
  parsed: DateParsed | null;
}

export interface DateParsed {
  year: number;
  month: number;
  day: number;
}

export interface Source {
  source: string;
  name: string;
  website: string;
  contact: Contact | null;
}

export interface Contact {
  addresses: Address[];
  emails: any[];
  phones: Phone[];
}

export interface Address {
  property_record_available: null;
  property_related_info: null;
  id: number;
  full: string;
  parsed: OwnerAddressParsed;
  geo: null;
  meta: null;
  type: string;
  is_private: null;
}

export interface OwnerAddressParsed {
  primary_address_number: string;
  pre_direction: string;
  street_name: string;
  street_type: string;
  post_direction: string;
  unit_number: string;
  unit_designator: string;
  city: string;
  state: string;
  zip5: string;
  zip4: string;
  country: string;
  delivery_address_line: string;
}

export interface Phone {
  number: string;
  extension: string;
  type: string;
  carrier: string;
  dialable: null;
  country_code: number;
  geo: null;
  meta: PhoneMeta | null;
}

export interface PhoneMeta {
  confidence: number;
  first_seen_date: DateClass | null;
  last_seen_date: null;
  hash: null;
  times_seen: number;
  premium: null;
  is_best: null;
}

export interface Vehicle {
  color: string;
  make: string;
  model: string;
  style: string;
  type: string;
  trim: string;
  mileage: string;
  vin: string;
  year: number;
  engine_code: string;
  molding_code: string;
  production_date: null;
  trim_color: string;
}

export interface Auction {
  buy_it_now_price: number;
  currency_code: string;
  copart_select: null;
  date: DateClass;
  day_of_week: string;
  est_retail_value: number;
  high_bid: number;
  id: number;
  item_number: string;
  lot_cond_code: string;
  make_an_offer_eligible: null;
  rentals: null;
  repair_cost: number;
  runs_drives: string;
  sale: null;
  source: string;
  special_note: string;
  time_zone: string;
  vehicle_condition_details: null;
  images: null;
}

export interface Design {
  current_color: Color;
  style: string;
  trim: string;
  short_trim: string;
  trim_variations: string;
  series: string;
  standard_seating: number;
  optional_seating: number;
  height: string;
  length: string;
  width: string;
  doors: number;
  colors: Color[];
}

export interface Color {
  category: string;
  code: string;
  name: string;
  generic_name: string;
  date: DateClass | null;
}

export interface Mileage {
  miles: number;
  date: DateClass;
}

export interface Export {
  date: DateClass;
  state: string;
  status: string;
}

export interface Image {
  url: string;
  thumb: string;
  confidence_score: number;
  source: string;
  meta: null;
  is_moderated: null;
}

export interface Impound {
  date: DateClass;
  state: string;
}

export interface Lien {
  date: DateClass;
  lienholder: string;
}

export interface Origin {
  country: string;
  city: string;
}

export interface OwnershipCosts {
  mileage_start: number;
  mileage_per_year: number;
  total: number;
  costs: Cost[];
}

export interface Cost {
  depreciation: number;
  insurance: number;
  fuel: number;
  maintenance: number;
  repairs: number;
  fees: number;
  total: number;
}

export interface OwnershipHistory {
  data_date: DateClass;
  dealer_type: string;
  fleet: string;
  is_new: null;
  lease: string;
  lien_holder: string;
  odometer: string;
  owner_address: Address;
  price: number;
  pump: string;
  reg_class: string;
  segment: string;
  seller: string;
  seller_address: Address;
  state_data: string;
}

export interface Prices {
  msrp: number;
  highest: number;
  average: number;
  lowest: number;
  invoice_price: number;
  delivery_charges: number;
  certainty: number;
  mean: number;
  count: number;
  mileage: number;
  stdev: number;
  period: Period[];
}

export interface Period {
  date: DateClass;
  meta: PhoneMeta;
}

export interface Recall {
  campaign: string;
  components: string;
  consequence: string;
  date: DateClass;
  is_approved: null;
  is_excluded: null;
  labor_hours: number;
  not_available_reason: string;
  notes: string;
  oem_code: string;
  oem_description: string;
  oem_recall_number: string;
  parts_cost: number;
  refresh_date: null;
  remedy: string;
  severity_code: string;
  source: string;
  state: string;
  status: string;
  summary: string;
  type: string;
}

export interface Sale {
  date: DateClass;
  history: History;
  listing_price: number;
  listing_url: string;
  inventory_type: string;
  meta: PhoneMeta;
  type: string;
  seller: Seller;
  vehicle: Vehicle;
  images: any[];
  source: string;
}

export interface History {
  days_on_market: number;
  mileage_change: number;
  mileage_change_pct: number;
  price_change: number;
  price_change_pct: number;
}

export interface Seller {
  address: Address;
  name: string;
  type: string;
}

export interface Salvage {
  date: DateClass | null;
  estimated_damage: number;
  exterior_color: string;
  listing_id: string;
  location: string;
  odometer: string;
  primary_damage: string;
  sale_document: string;
  secondary_damage: string;
  title_type: string;
  type: string;
  vin: string;
  disposition_text: string;
  intended_for_export: boolean | null;
  obtained_date: DateClass | null;
  source: Source;
  premium: boolean | null;
  images: any[];
}

export interface Specs {
  anti_brake_system: string;
  driven_wheels: string;
  drivetrain: string;
  steering_type: string;
  city_mileage: string;
  highway_mileage: string;
  gross_weight: number;
  curb_weight: number;
  engine: Engine;
  transmission: Transmission;
}

export interface Engine {
  engine: string;
  block: string;
  cylinders: number;
  size: number;
  fuel_capacity: string;
  fuel_type: string;
}

export interface Transmission {
  gears: number;
  type: string;
}

export interface Theft {
  date: DateClass;
  date_of_recovery: null;
  date_of_theft: null;
  record_type: string;
  report_id: string;
  theft_reported_state: string;
  status: string;
  source: null;
  vehicle: null;
}

export interface TitleCheck {
  date: DateClass;
  code: string;
  description: string;
  reporting_entity: ReportingEntity;
}

export interface ReportingEntity {
  id: string;
  category_code: string;
  category_text: string;
  source: string;
  name: string;
  website: string;
  contact: null;
}

export interface TitleRegistration {
  date: DateClass;
  issuing_authority: string;
  odometer: number;
  vin: string;
  history?: TitleRegistration[];
}

export interface Warranty {
  is_active: boolean;
  miles: string;
  months: string;
  type: string;
}

export interface Meta {
  counts: Counts;
  report_info: ReportInfo;
}

export interface Counts {
  vehicles: CountsVehicles;
}

export interface CountsVehicles {
  automobiles: number;
}

export interface ReportInfo {
  report_id: string;
  response_time: number;
}
