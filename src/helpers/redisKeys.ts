export const authNonceCache = {
  getKey: (userid: number, publicKey: string): string => {
    return `auth_nonce:${userid}:${publicKey}`
  },

  getTTL: (): number => {
    return 180
  }
}

export const userOnlineCache = {
  getKey: (userid: number | undefined) => {
    return `user:online:${userid}`
  },

  // keep 12 hours for now
  getTTL: (): number => {
    return 43200
  }
}

export const revokedTokenCache = {
  getKey: (token: string): string => {
    return `auth:revoked:${token}`
  }
}