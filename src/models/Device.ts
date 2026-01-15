export interface Device {
  device_pbk: string
  device_name: string
  os: string
  browser: string
  created_at: Date
  last_seen_at: Date
  userid: number
}

export interface InsertDevice {
  device_pbk: string
  device_name: string
  os: string
  browser: string
  userid: number
}

export interface LoginKeys {
  device_pbk: string;
  identity_pbk: string;
}