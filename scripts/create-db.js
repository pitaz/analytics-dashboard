const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

async function createDatabase() {
  // Parse the DATABASE_URL to get connection details
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL is not set in .env.local');
    console.log('\nPlease create a .env.local file with:');
    console.log('DATABASE_URL=postgresql://username:password@localhost:5432/analytics_db');
    process.exit(1);
  }

  try {
    // Parse the connection string
    // Handle both postgresql:// and postgres:// protocols
    let url;
    try {
      url = new URL(databaseUrl);
    } catch (e) {
      // If URL parsing fails, try to parse manually
      const match = databaseUrl.match(/postgres(ql)?:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
      if (!match) {
        throw new Error('Invalid DATABASE_URL format');
      }
      url = {
        protocol: 'postgresql:',
        username: match[2],
        password: match[3],
        hostname: match[4],
        port: match[5],
        pathname: '/' + match[6],
        origin: `${match[1] ? 'postgresql' : 'postgres'}://${match[2]}:${match[3]}@${match[4]}:${match[5]}`,
      };
    }

    const dbName = url.pathname.slice(1).split('?')[0]; // Remove leading / and query params
    const adminUrl = databaseUrl.replace(`/${dbName}`, '/postgres');

    console.log(`📦 Creating database: ${dbName}`);

    // Connect to the default 'postgres' database to create the new database
    const adminClient = new Client({
      connectionString: adminUrl,
    });

    await adminClient.connect();
    
    // Check if database exists
    const checkResult = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (checkResult.rows.length > 0) {
      console.log(`✅ Database "${dbName}" already exists`);
      await adminClient.end();
      
      // Still run migrations in case tables don't exist
      console.log('\n📋 Running migrations...');
      const { execSync } = require('child_process');
      try {
        execSync('npm run db:migrate', { stdio: 'inherit' });
      } catch (e) {
        // Migration might fail if tables already exist, that's okay
      }
      return;
    }

    // Create the database
    await adminClient.query(`CREATE DATABASE "${dbName}"`);
    console.log(`✅ Database "${dbName}" created successfully`);
    
    await adminClient.end();

    // Now run migrations
    console.log('\n📋 Running migrations...');
    const { execSync } = require('child_process');
    execSync('npm run db:migrate', { stdio: 'inherit' });

    console.log('\n🌱 Seeding database...');
    execSync('npm run db:seed', { stdio: 'inherit' });

    console.log('\n✅ Database setup complete!');
  } catch (error) {
    if (error.code === '3D000') {
      console.error(`❌ Database does not exist and could not be created.`);
      console.error(`   Make sure PostgreSQL is running and you have permission to create databases.`);
    } else if (error.code === 'ECONNREFUSED') {
      console.error(`❌ Could not connect to PostgreSQL.`);
      console.error(`   Make sure PostgreSQL is running on the specified host and port.`);
      console.error(`   Try: brew services start postgresql (on macOS)`);
    } else if (error.code === '28P01') {
      console.error(`❌ Authentication failed.`);
      console.error(`   Check your username and password in DATABASE_URL.`);
    } else {
      console.error('❌ Error:', error.message);
      console.error('   Full error:', error);
    }
    process.exit(1);
  }
}

createDatabase();

