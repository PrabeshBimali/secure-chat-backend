import { PoolClient } from "pg";
import db from "../config/db.js"
import { Device, InsertDevice, LoginKeys } from "../models/Device.js";

export async function insert(device: InsertDevice, client?: PoolClient) {
  const query = `INSERT INTO devices(device_pbk, device_name, browser, os, userid) VALUES($1, $2, $3, $4, $5)`

  if(!client) {
    await db.query(query, [device.device_pbk, device.device_name, device.browser, device.os, device.userid]) 
    return
  }

  await client.query(query, [device.device_pbk, device.device_name, device.browser, device.os, device.userid])
}

export async function existsForUser(device_pbk: string, userid: number) {
  const query = `SELECT 1 FROM devices WHERE device_pbk=$1 AND userid=$2`
  const rows = await db.query(query, [device_pbk, userid])

  if(rows.rowCount === 0 || rows.rowCount === null) {
    return false
  }

  return true
}

export async function findById(device_pbk: string): Promise<Device | null>{
  const query = `SELECT * FROM devices WHERE device_pbk=$1`
  const response = await db.query(query, [device_pbk])

  if(response.rowCount === null || response.rowCount <= 0) {
    return null
  }

  return response.rows[0]
}

export async function findDeviceAndIdentityKeys(userid: number, device_pbk: string): Promise<LoginKeys | null> {
  const query = `SELECT devices.device_pbk, users.identity_pbk FROM users
    INNER JOIN devices ON devices.userid=users.id WHERE users.id = $1 and devices.device_pbk = $2`
    
  const response = await db.query(query, [userid, device_pbk])

  if(response.rowCount === null || response.rowCount <= 0) {
    return null
  }

  return response.rows[0]
}