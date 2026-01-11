import { PoolClient } from "pg";
import { InsertDevice } from "../models/Device.js";

export async function insert(client: PoolClient, device: InsertDevice) {
  const query = `INSERT INTO devices(device_pbk, device_name, browser, os, userid) VALUES($1, $2, $3, $4, $5)`
  await client.query(query, [device.device_pbk, device.device_name, device.browser, device.os, device.userid])
}