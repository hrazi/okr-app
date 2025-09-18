const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

function setupDatabase() {
  const dbPath = path.join(__dirname, '..', 'database', 'okr_summaries.db');
  const dbDir = path.dirname(dbPath);
  
  // Create database directory if it doesn't exist
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  
  const db = new Database(dbPath);
  
  // Create tables
  db.exec(`
    -- OKR Summaries table
    CREATE TABLE IF NOT EXISTS summaries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      version INTEGER DEFAULT 1,
      status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived'))
    );
    
    -- OKR Summary History table
    CREATE TABLE IF NOT EXISTS summary_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      summary_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      version INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (summary_id) REFERENCES summaries (id) ON DELETE CASCADE
    );
    
    -- Work Items table (from Azure DevOps)
    CREATE TABLE IF NOT EXISTS work_items (
      id INTEGER PRIMARY KEY,
      summary_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      work_item_type TEXT,
      state TEXT,
      assigned_to TEXT,
      area_path TEXT,
      iteration_path TEXT,
      description TEXT,
      created_date DATETIME,
      changed_date DATETIME,
      tags TEXT,
      priority INTEGER,
      effort REAL,
      business_value INTEGER,
      FOREIGN KEY (summary_id) REFERENCES summaries (id) ON DELETE CASCADE
    );
    
    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_summaries_status ON summaries(status);
    CREATE INDEX IF NOT EXISTS idx_summaries_created_at ON summaries(created_at);
    CREATE INDEX IF NOT EXISTS idx_summary_history_summary_id ON summary_history(summary_id);
    CREATE INDEX IF NOT EXISTS idx_summary_history_version ON summary_history(summary_id, version);
    CREATE INDEX IF NOT EXISTS idx_work_items_summary_id ON work_items(summary_id);
    CREATE INDEX IF NOT EXISTS idx_work_items_state ON work_items(state);
    CREATE INDEX IF NOT EXISTS idx_work_items_work_item_type ON work_items(work_item_type);
  `);
  
  console.log('✅ Database setup completed successfully!');
  console.log(`📁 Database location: ${dbPath}`);
  
  db.close();
  return dbPath;
}

function resetDatabase() {
  const dbPath = path.join(__dirname, '..', 'database', 'okr_summaries.db');
  
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('🗑️  Database deleted');
  }
  
  return setupDatabase();
}

// Run setup if called directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase, resetDatabase };