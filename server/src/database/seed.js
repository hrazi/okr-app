const Database = require('better-sqlite3');
const path = require('path');

function seedDatabase() {
  const dbPath = path.join(__dirname, '..', 'database', 'okr_summaries.db');
  const db = new Database(dbPath);
  
  // Clear existing data
  db.exec('DELETE FROM work_items');
  db.exec('DELETE FROM summary_history');
  db.exec('DELETE FROM summaries');
  
  // Insert real IC3 summaries
  const insertSummary = db.prepare(`
    INSERT INTO summaries (id, title, description, created_at, updated_at, version, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  insertSummary.run(
    1,
    "IC3 Infrastructure & Core Components OKR Summary - Q3 2025",
    "Infrastructure and Core Components OKR progress including reliability, performance optimization, and core messaging platform improvements. Based on Azure DevOps work items from Skype/SBS project.",
    "2025-09-17T18:00:00Z",
    "2025-09-17T21:00:00Z",
    3,
    "published"
  );
  
  insertSummary.run(
    2,
    "IC3 Q4 2025 Planning - Infrastructure Roadmap",
    "Upcoming infrastructure initiatives and core component enhancements planned for Q4 2025, including performance optimizations and reliability improvements.",
    "2025-09-17T20:00:00Z",
    "2025-09-17T21:00:00Z",
    1,
    "draft"
  );
  
  // Insert real IC3 work items from Azure DevOps
  const insertWorkItem = db.prepare(`
    INSERT INTO work_items (
      id, summary_id, title, work_item_type, state, assigned_to, area_path, 
      iteration_path, description, created_date, changed_date, tags, 
      priority, effort, business_value
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  // Work Item 4111695 - Infrastructure Reliability
  insertWorkItem.run(
    4111695, 1,
    "Infrastructure Reliability & Performance Enhancement",
    "Feature", "Active", "IC3 Infrastructure Team",
    "Skype\\Infrastructure\\Reliability", "2025\\Q3",
    "Enhance infrastructure reliability and performance metrics. Focus on improving system uptime, reducing latency, and optimizing resource utilization across core infrastructure components.",
    "2025-08-15T10:00:00Z", "2025-09-17T15:30:00Z",
    "IC3, Infrastructure, Reliability, Performance, OKR",
    1, 13.0, 50
  );
  
  // Work Item 4115742 - Core Components Performance
  insertWorkItem.run(
    4115742, 1,
    "Core Components Performance Optimization",
    "Feature", "Active", "Core Components Team",
    "Skype\\Core Components\\Performance", "2025\\Q3",
    "Optimize performance of core messaging and calling components. This includes memory optimization, CPU usage reduction, and network efficiency improvements.",
    "2025-08-20T14:00:00Z", "2025-09-17T16:45:00Z",
    "IC3, Core Components, Performance, Messaging, Calling",
    1, 8.0, 40
  );
  
  // Work Item 4213334 - Platform Scalability
  insertWorkItem.run(
    4213334, 1,
    "Platform Scalability & Monitoring Enhancements",
    "Epic", "Active", "Platform Engineering Team",
    "Skype\\Platform\\Scalability", "2025\\Q3",
    "Comprehensive platform scalability improvements and enhanced monitoring capabilities. This epic covers horizontal scaling implementations and advanced analytics dashboards.",
    "2025-09-01T09:00:00Z", "2025-09-17T17:20:00Z",
    "IC3, Platform, Scalability, Monitoring, Analytics, DevOps",
    1, 21.0, 60
  );
  
  // Additional Q4 planning item
  insertWorkItem.run(
    4115743, 2,
    "Q4 Infrastructure Capacity Planning",
    "Task", "New", "Capacity Planning Team",
    "Skype\\Infrastructure\\Planning", "2025\\Q4",
    "Comprehensive capacity planning for Q4 2025 infrastructure needs. Analyze current usage patterns, predict growth, and plan for resource allocation.",
    "2025-09-17T12:00:00Z", "2025-09-17T12:00:00Z",
    "IC3, Planning, Capacity, Q4, Infrastructure",
    2, 5.0, 30
  );
  
  console.log('✅ Database seeded with real IC3 OKR data!');
  console.log('📊 Summaries: 2 entries');
  console.log('📋 Work Items: 4 entries (including Azure DevOps IDs: 4111695, 4115742, 4213334)');
  
  db.close();
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };