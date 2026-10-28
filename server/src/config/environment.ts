import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../../../.env'),
  path.resolve(__dirname, '../.env'),
];

for (const p of envPaths) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
    break;
  }
}

const sanitizeMongoUri = (uri: string): string => {
  try {
    if (!uri) return uri;
    const prefix = uri.startsWith('mongodb+srv://')
      ? 'mongodb+srv://'
      : uri.startsWith('mongodb://')
      ? 'mongodb://'
      : '';
    if (!prefix) return uri;

    const rest = uri.slice(prefix.length);
    const lastAtIndex = rest.lastIndexOf('@');
    if (lastAtIndex > -1) {
      const userPass = rest.slice(0, lastAtIndex);
      const hostAndOptions = rest.slice(lastAtIndex + 1);
      const firstColonIndex = userPass.indexOf(':');
      if (firstColonIndex > -1) {
        const username = userPass.slice(0, firstColonIndex);
        const rawPassword = userPass.slice(firstColonIndex + 1);
        const encodedPassword = encodeURIComponent(decodeURIComponent(rawPassword));
        return `${prefix}${username}:${encodedPassword}@${hostAndOptions}`;
      }
    }
    return uri;
  } catch {
    return uri;
  }
};

const rawMongoUri =
  process.env.MONGODB_URI ||
  'mongodb+srv://babupalani9598_db_user:Arivubabu%40143@cluster0.xdbp781.mongodb.net/ridenload?retryWrites=true&w=majority&appName=Cluster0';

export const ENV = {
  PORT: parseInt(process.env.PORT || '10000', 10),
  NODE_ENV: process.env.NODE_ENV || 'production',
  MONGODB_URI: sanitizeMongoUri(rawMongoUri),
  JWT_SECRET: process.env.JWT_SECRET || 'super_secret_jwt_key_droptaxi_platform_2026_secure',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'super_secret_refresh_token_key_droptaxi_platform_2026',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  SIMULATION_ENABLED: process.env.SIMULATION_ENABLED === 'true' || true,
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || '',
};
