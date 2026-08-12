/** Append short MongoDB driver timeouts so dev fails fast when the DB is down. */
export function withMongoTimeouts(databaseUrl: string): string {
  if (/serverSelectionTimeoutMS=/i.test(databaseUrl)) {
    return databaseUrl;
  }

  const separator = databaseUrl.includes("?") ? "&" : "?";
  return `${databaseUrl}${separator}serverSelectionTimeoutMS=2500&connectTimeoutMS=2500&socketTimeoutMS=8000`;
}
