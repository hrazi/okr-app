# OKR Summary Application

A comprehensive web application for managing and visualizing OKR (Objectives and Key Results) summaries with historical tracking, built with React, Node.js, and SQLite. This application provides an intuitive interface for tracking team objectives, work items, and executive summaries.

## 🎯 Purpose & Origins

This application was designed to bridge the gap between high-level OKR tracking and detailed work item management. It integrates data from multiple sources to provide a unified view of team progress and objectives.

## ✨ Features

- 📊 **Executive Summary Dashboard** - High-level overview with key metrics
- 🎯 **OKR Visualization** - Interactive objective and key result tracking
- 📋 **Raw Data View** - Detailed work item and summary management
- 🔍 **Enhanced Search & Filtering** - Find summaries and work items quickly
- 📁 **Version Control** - Track changes and maintain history
- 🎨 **Interactive UI** - Expandable cards, hover effects, and responsive design
- 📈 **Progress Tracking** - Visual indicators for completion status

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm run install:all
   ```

2. **Set up the database:**
   ```bash
   npm run setup
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
okr-app/
├── client/                 # React frontend application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── ExecutiveSummary.tsx    # High-level metrics display
│   │   │   ├── Header.tsx              # Navigation header
│   │   │   ├── LegacyDataView.tsx      # Enhanced interactive data view
│   │   │   └── OKRVisualization.tsx    # OKR structure visualization
│   │   ├── pages/         # Page components
│   │   │   └── Dashboard.tsx           # Main dashboard with tabs
│   │   ├── services/      # API integration
│   │   │   ├── api.ts                  # HTTP client and endpoints
│   │   │   └── okrService.ts           # OKR-specific business logic
│   │   ├── types/         # TypeScript definitions
│   │   │   ├── api.ts                  # API response types
│   │   │   └── okr.ts                  # OKR domain types
│   │   └── ...
│   └── package.json
├── server/                # Express.js backend
│   ├── src/
│   │   ├── database/      # Database setup and seeding
│   │   │   ├── okr_summaries.db       # SQLite database file
│   │   │   ├── seed.js                # Sample data for development
│   │   │   └── setup.js               # Database schema creation
│   │   ├── routes/        # API route handlers
│   │   │   ├── summaries.js           # Summary CRUD operations
│   │   │   └── workItems.js           # Work item management
│   │   └── index.js       # Express server configuration
│   └── package.json
└── package.json           # Root package.json with scripts
```

## 🏗️ Technology Stack

- **Frontend:** React 18, TypeScript, Material-UI v5, Create React App
- **Backend:** Node.js, Express.js, CORS middleware
- **Database:** SQLite with better-sqlite3 driver
- **Development:** Concurrently for parallel server execution
- **UI Components:** Material-UI with custom theming and animations

## 📊 Data Model & Field Origins

### Summary Entity
The Summary entity represents high-level OKR summaries and reports:

| Field | Type | Origin & Purpose | Source |
|-------|------|------------------|---------|
| `id` | INTEGER | Primary key, auto-incrementing identifier | Database generated |
| `title` | TEXT | Summary title/name for identification | User input via forms/API |
| `description` | TEXT | Detailed summary content and objectives | User input, markdown supported |
| `created_at` | DATETIME | Record creation timestamp | System generated (ISO 8601) |
| `updated_at` | DATETIME | Last modification timestamp | System updated on changes |
| `version` | INTEGER | Version control for tracking changes | Auto-incremented on updates |
| `status` | TEXT | Publication status: 'draft', 'published', 'archived' | User workflow state |

**Status Field Values:**
- `draft` - Work in progress, not yet finalized
- `published` - Approved and visible to stakeholders  
- `archived` - Historical record, no longer active

### Work Item Entity
Work Items represent individual tasks, features, or deliverables linked to OKR summaries:

| Field | Type | Origin & Purpose | Azure DevOps Equivalent |
|-------|------|------------------|--------------------------|
| `id` | INTEGER | Primary key, work item identifier | Work Item ID |
| `summary_id` | INTEGER | Foreign key linking to parent summary | Custom field/tag |
| `title` | TEXT | Work item title/name | System.Title |
| `work_item_type` | TEXT | Type classification (Task, Bug, Feature, etc.) | System.WorkItemType |
| `state` | TEXT | Current status (New, Active, Resolved, Closed) | System.State |
| `assigned_to` | TEXT | Person responsible for the work item | System.AssignedTo |
| `area_path` | TEXT | Organizational hierarchy/team assignment | System.AreaPath |
| `iteration_path` | TEXT | Sprint/iteration assignment | System.IterationPath |
| `description` | TEXT | Detailed work item description | System.Description |
| `created_date` | DATETIME | Work item creation date | System.CreatedDate |
| `changed_date` | DATETIME | Last modification date | System.ChangedDate |
| `tags` | TEXT | Comma-separated labels for categorization | System.Tags |
| `priority` | INTEGER | Priority level (1-4, where 1 is highest) | Microsoft.VSTS.Common.Priority |
| `effort` | DECIMAL | Story points or effort estimation | Microsoft.VSTS.Scheduling.Effort |
| `business_value` | INTEGER | Business value rating | Microsoft.VSTS.Common.BusinessValue |

### Executive Summary Entity (Derived)
Generated from aggregated data for dashboard display:

| Field | Type | Origin & Purpose | Calculation Method |
|-------|------|------------------|-------------------|
| `totalObjectives` | INTEGER | Count of all objectives | Count of unique objectives |
| `completedObjectives` | INTEGER | Count of completed objectives | Count where status = 'completed' |
| `totalKeyResults` | INTEGER | Count of all key results | Sum of key results across objectives |
| `completedKeyResults` | INTEGER | Count of achieved key results | Count where progress >= 100% |
| `overallProgress` | DECIMAL | Overall completion percentage | Weighted average of all progress |
| `upcomingDeadlines` | INTEGER | Count of items due soon | Count where due_date <= now + 7 days |

### OKR Visualization Data
Structured data for objective tracking:

| Field | Type | Origin & Purpose | Business Logic |
|-------|------|------------------|----------------|
| `id` | STRING | Objective identifier | Generated from summary data |
| `title` | STRING | Objective title | Extracted from summary content |
| `description` | STRING | Objective details | Parsed from description |
| `progress` | NUMBER | Completion percentage (0-100) | Calculated from key results |
| `keyResults` | ARRAY | Associated key results | Related work items |
| `status` | STRING | Current state | Derived from progress thresholds |
| `dueDate` | DATE | Target completion date | Set during objective creation |
| `owner` | STRING | Responsible person/team | Assigned owner |

## 🔄 Data Flow & Integration

### 1. **Data Sources**
- **Manual Entry**: Summaries and objectives created through the UI
- **Azure DevOps Integration**: Work items imported via API (configurable)
- **Historical Data**: Previous versions maintained for trend analysis

### 2. **Data Processing Pipeline**
```
Raw Data → Validation → Normalization → Storage → API → Frontend Display
```

### 3. **Field Mappings from External Sources**

**Azure DevOps → Application Mapping:**
```javascript
{
  "System.Id": "id",
  "System.Title": "title", 
  "System.WorkItemType": "work_item_type",
  "System.State": "state",
  "System.AssignedTo": "assigned_to",
  "System.AreaPath": "area_path",
  "System.IterationPath": "iteration_path",
  "System.Description": "description",
  "System.CreatedDate": "created_date",
  "System.ChangedDate": "changed_date",
  "System.Tags": "tags",
  "Microsoft.VSTS.Common.Priority": "priority",
  "Microsoft.VSTS.Scheduling.Effort": "effort",
  "Microsoft.VSTS.Common.BusinessValue": "business_value"
}
```

## 🎨 UI Components & Features

### Enhanced LegacyDataView Component
**Interactive Elements:**
- **Expandable Cards**: Click to show/hide detailed information
- **Status Indicators**: Color-coded chips with status icons
- **Action Buttons**: Quick access to view, edit, and external links
- **Hover Effects**: Visual feedback with elevation and animations
- **Smart Truncation**: Text preview with expand/collapse functionality

**Clickable Elements:**
- Summary titles → Full summary view
- Status chips → Status filtering (future enhancement)
- Work item titles → Azure DevOps integration
- Tag chips → Tag-based filtering
- Action buttons → Context-specific actions

### Dashboard Tabs
1. **Executive Summary**: High-level metrics and KPIs
2. **OKR Structure**: Visual representation of objectives and key results  
3. **Raw Data View**: Detailed summary and work item management

## 🔌 API Endpoints

### Summary Management
- `GET /api/summaries` - Retrieve all summaries with pagination
- `GET /api/summaries/:id` - Get specific summary with details
- `POST /api/summaries` - Create new summary
- `PUT /api/summaries/:id` - Update existing summary
- `DELETE /api/summaries/:id` - Soft delete summary
- `GET /api/summaries/:id/history` - Get version history

### Work Item Management  
- `GET /api/work-items` - Get all work items with filtering
- `GET /api/work-items/summary/:summaryId` - Get items for specific summary
- `POST /api/work-items` - Create new work item
- `PUT /api/work-items/:id` - Update work item
- `DELETE /api/work-items/:id` - Remove work item

### Analytics & Reporting
- `GET /api/analytics/summary` - Executive dashboard data
- `GET /api/analytics/progress` - Progress tracking metrics
- `GET /api/analytics/trends` - Historical trend analysis

## 🛠️ Development Workflow

### Environment Setup
```bash
# Install all dependencies
npm run install:all

# Set up database with sample data
npm run setup

# Start development servers
npm run dev

# Frontend only
npm run client:dev

# Backend only  
npm run server:dev
```

### Database Management
```bash
# Reset database with fresh schema
npm run db:reset

# Seed with sample data
npm run db:seed

# Backup current database
npm run db:backup
```

## 🔧 Configuration

### Environment Variables
Create `.env` files for environment-specific settings:

**Server (.env)**:
```
PORT=5000
DB_PATH=./database/okr_summaries.db
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

**Client (.env.local)**:
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENVIRONMENT=development
```

## 📈 Future Enhancements

- **Azure DevOps Integration**: Real-time work item synchronization
- **Authentication**: User management and role-based access
- **Notifications**: Email/Slack alerts for status changes
- **Advanced Analytics**: Trend analysis and predictive insights
- **Export Features**: PDF reports and data export
- **Mobile App**: React Native companion application

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for better OKR management and team transparency**