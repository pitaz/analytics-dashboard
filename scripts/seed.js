const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seed() {
  try {
    // Generate sample metrics data
    const categories = ['revenue', 'users', 'conversion', 'engagement', 'performance'];
    const now = new Date();
    
    for (let i = 0; i < 1000; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const timestamp = new Date(now.getTime() - i * 60000); // 1 minute intervals
      
      let value;
      switch (category) {
        case 'revenue':
          value = Math.random() * 10000 + 5000;
          break;
        case 'users':
          value = Math.floor(Math.random() * 5000 + 1000);
          break;
        case 'conversion':
          value = Math.random() * 10 + 2;
          break;
        case 'engagement':
          value = Math.random() * 100 + 50;
          break;
        case 'performance':
          value = Math.random() * 2000 + 500;
          break;
        default:
          value = Math.random() * 1000;
      }
      
      await pool.query(
        `INSERT INTO metrics (name, value, category, timestamp) 
         VALUES ($1, $2, $3, $4)`,
        [`${category}_metric_${i}`, value, category, timestamp]
      );
    }
    
    console.log('✅ Database seeded successfully with 1000 sample records');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();

