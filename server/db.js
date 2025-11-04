import mysql from 'mysql'

const poolCache = new Map()

function normalizeConfig(options = {}) {
  const parsedPort = Number.parseInt(options.port ?? options.MYSQL_PORT ?? '3306', 10)
  const port = Number.isFinite(parsedPort) ? parsedPort : 3306
  const parsedLimit = Number.parseInt(options.connectionLimit ?? '10', 10)
  const connectionLimit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : null

  return {
    host: options.host ?? 'localhost',
    port,
    user: options.user ?? 'root',
    password: options.password ?? 'admin',
    database: options.database ?? 'eshop',
    connectionLimit,
  }
}

function getPoolKey(config) {
  return JSON.stringify({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    connectionLimit: config.connectionLimit ?? null,
  })
}

function ensurePool(rawOptions = {}) {
  const config = normalizeConfig(rawOptions)
  const key = getPoolKey(config)
  let entry = poolCache.get(key)
  if (entry) {
    return entry
  }

  const { connectionLimit, ...connectionOptions } = config
  const pool = mysql.createPool({
    ...connectionOptions,
    ...(connectionLimit ? { connectionLimit } : {}),
  })
  poolCache.set(key, pool)
  return pool
}

export function query(sql, options = {}) {
  const pool = ensurePool(options)
  return new Promise((resolve, reject) => {
    pool.query(sql, (error, results) => {
      if (error) {
        reject(error)
        return
      }
      resolve(results)
    })
  })
}

export async function closeAllPools() {
  const closures = []
  for (const [key, pool] of poolCache.entries()) {
    poolCache.delete(key)
    closures.push(
      new Promise((resolve) => {
        pool.end?.(() => resolve())
        if (!pool.end) {
          resolve()
        }
      })
    )
  }
  await Promise.allSettled(closures)
}

export default { query, closeAllPools }
