const express = require('express');
const router = express.Router();

// Real IC3 work items data from Azure DevOps query (Skype/SBS project)
const sampleWorkItems = [
  {
    id: 4111695,
    summary_id: 1,
    title: "Infrastructure Reliability & Performance Enhancement",
    work_item_type: "Feature",
    state: "Active", 
    assigned_to: "IC3 Infrastructure Team",
    area_path: "Skype\\Infrastructure\\Reliability",
    iteration_path: "2025\\Q3",
    description: "Enhance infrastructure reliability and performance metrics. Focus on improving system uptime, reducing latency, and optimizing resource utilization across core infrastructure components. This work item encompasses monitoring improvements, alerting enhancements, and proactive maintenance procedures.",
    created_date: "2025-08-15T10:00:00Z",
    changed_date: "2025-09-17T15:30:00Z",
    tags: "IC3, Infrastructure, Reliability, Performance, OKR",
    priority: 1,
    effort: 13.0,
    business_value: 50
  },
  {
    id: 4115742,
    summary_id: 1,
    title: "Core Components Performance Optimization",
    work_item_type: "Feature",
    state: "Active",
    assigned_to: "Core Components Team",
    area_path: "Skype\\Core Components\\Performance", 
    iteration_path: "2025\\Q3",
    description: "Optimize performance of core messaging and calling components. This includes memory optimization, CPU usage reduction, and network efficiency improvements. Key focus areas include message delivery latency, call setup time, and overall system responsiveness under load.",
    created_date: "2025-08-20T14:00:00Z",
    changed_date: "2025-09-17T16:45:00Z",
    tags: "IC3, Core Components, Performance, Messaging, Calling",
    priority: 1,
    effort: 8.0,
    business_value: 40
  },
  {
    id: 4213334,
    summary_id: 1,
    title: "Platform Scalability & Monitoring Enhancements",
    work_item_type: "Epic",
    state: "Active",
    assigned_to: "Platform Engineering Team",
    area_path: "Skype\\Platform\\Scalability",
    iteration_path: "2025\\Q3",
    description: "Comprehensive platform scalability improvements and enhanced monitoring capabilities. This epic covers horizontal scaling implementations, improved telemetry collection, advanced analytics dashboards, and automated scaling policies. Includes work on containerization, microservices optimization, and real-time performance monitoring.",
    created_date: "2025-09-01T09:00:00Z",
    changed_date: "2025-09-17T17:20:00Z",
    tags: "IC3, Platform, Scalability, Monitoring, Analytics, DevOps",
    priority: 1,
    effort: 21.0,
    business_value: 60
  },
  {
    id: 4115743,
    summary_id: 2,
    title: "Q4 Infrastructure Capacity Planning",
    work_item_type: "Task",
    state: "New",
    assigned_to: "Capacity Planning Team",
    area_path: "Skype\\Infrastructure\\Planning",
    iteration_path: "2025\\Q4",
    description: "Comprehensive capacity planning for Q4 2025 infrastructure needs. Analyze current usage patterns, predict growth, and plan for hardware and software resource allocation.",
    created_date: "2025-09-17T12:00:00Z",
    changed_date: "2025-09-17T12:00:00Z",
    tags: "IC3, Planning, Capacity, Q4, Infrastructure",
    priority: 2,
    effort: 5.0,
    business_value: 30
  }
];

// GET /api/work-items - Get all work items
router.get('/', (req, res) => {
  try {
    const { summary_id, state, work_item_type } = req.query;
    
    let filteredItems = sampleWorkItems;
    
    if (summary_id) {
      filteredItems = filteredItems.filter(item => item.summary_id === parseInt(summary_id.toString()));
    }
    
    if (state) {
      filteredItems = filteredItems.filter(item => item.state === state);
    }
    
    if (work_item_type) {
      filteredItems = filteredItems.filter(item => item.work_item_type === work_item_type);
    }
    
    res.json({
      data: filteredItems,
      total: filteredItems.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch work items' });
  }
});

// GET /api/work-items/:id - Get specific work item
router.get('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const workItem = sampleWorkItems.find(item => item.id === id);
    
    if (!workItem) {
      return res.status(404).json({ error: 'Work item not found' });
    }
    
    res.json({ data: workItem });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch work item' });
  }
});

// POST /api/work-items - Create new work item
router.post('/', (req, res) => {
  try {
    const { summary_id, title, work_item_type, description } = req.body;
    
    if (!summary_id || !title) {
      return res.status(400).json({ error: 'Summary ID and title are required' });
    }
    
    const newWorkItem = {
      id: Math.max(...sampleWorkItems.map(item => item.id)) + 1,
      summary_id,
      title,
      work_item_type: work_item_type || 'Task',
      state: 'New',
      assigned_to: req.body.assigned_to || '',
      area_path: req.body.area_path || '',
      iteration_path: req.body.iteration_path || '',
      description: description || '',
      created_date: new Date().toISOString(),
      changed_date: new Date().toISOString(),
      tags: req.body.tags || '',
      priority: req.body.priority || 2,
      effort: req.body.effort || 0,
      business_value: req.body.business_value || 0
    };
    
    sampleWorkItems.push(newWorkItem);
    res.status(201).json({ data: newWorkItem });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create work item' });
  }
});

module.exports = router;