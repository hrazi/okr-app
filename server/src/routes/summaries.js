const express = require('express');
const router = express.Router();

// Real IC3 OKR data from Azure DevOps query
const sampleSummaries = [
  {
    id: 1,
    title: "IC3 Infrastructure & Core Components OKR Summary - Q3 2025",
    description: "Infrastructure and Core Components OKR progress including reliability, performance optimization, and core messaging platform improvements. Based on Azure DevOps work items from Skype/SBS project.",
    created_at: "2025-09-17T18:00:00Z",
    updated_at: "2025-09-17T21:00:00Z",
    version: 3,
    status: "published"
  },
  {
    id: 2,
    title: "IC3 Q4 2025 Planning - Infrastructure Roadmap", 
    description: "Upcoming infrastructure initiatives and core component enhancements planned for Q4 2025, including performance optimizations and reliability improvements.",
    created_at: "2025-09-17T20:00:00Z",
    updated_at: "2025-09-17T21:00:00Z",
    version: 1,
    status: "draft"
  }
];

// GET /api/summaries - Get all summaries
router.get('/', (req, res) => {
  try {
    const { status, search } = req.query;
    
    let filteredSummaries = sampleSummaries;
    
    if (status) {
      filteredSummaries = filteredSummaries.filter(s => s.status === status);
    }
    
    if (search) {
      const searchTerm = search.toString().toLowerCase();
      filteredSummaries = filteredSummaries.filter(s => 
        s.title.toLowerCase().includes(searchTerm) || 
        s.description?.toLowerCase().includes(searchTerm)
      );
    }
    
    res.json({
      data: filteredSummaries,
      total: filteredSummaries.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch summaries' });
  }
});

// GET /api/summaries/:id - Get specific summary
router.get('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const summary = sampleSummaries.find(s => s.id === id);
    
    if (!summary) {
      return res.status(404).json({ error: 'Summary not found' });
    }
    
    res.json({ data: summary });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

// POST /api/summaries - Create new summary
router.post('/', (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const newSummary = {
      id: Math.max(...sampleSummaries.map(s => s.id)) + 1,
      title,
      description: description || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      version: 1,
      status: 'draft'
    };
    
    sampleSummaries.push(newSummary);
    res.status(201).json({ data: newSummary });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create summary' });
  }
});

// PUT /api/summaries/:id - Update summary
router.put('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, description, status } = req.body;
    
    const summaryIndex = sampleSummaries.findIndex(s => s.id === id);
    if (summaryIndex === -1) {
      return res.status(404).json({ error: 'Summary not found' });
    }
    
    const summary = sampleSummaries[summaryIndex];
    
    if (title) summary.title = title;
    if (description !== undefined) summary.description = description;
    if (status) summary.status = status;
    summary.updated_at = new Date().toISOString();
    summary.version += 1;
    
    res.json({ data: summary });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update summary' });
  }
});

// DELETE /api/summaries/:id - Delete summary
router.delete('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const summaryIndex = sampleSummaries.findIndex(s => s.id === id);
    
    if (summaryIndex === -1) {
      return res.status(404).json({ error: 'Summary not found' });
    }
    
    sampleSummaries.splice(summaryIndex, 1);
    res.json({ message: 'Summary deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete summary' });
  }
});

// GET /api/summaries/:id/history - Get summary history
router.get('/:id/history', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const summary = sampleSummaries.find(s => s.id === id);
    
    if (!summary) {
      return res.status(404).json({ error: 'Summary not found' });
    }
    
    // Sample history data
    const history = [
      {
        id: 1,
        summary_id: id,
        title: summary.title,
        description: summary.description,
        version: summary.version,
        created_at: summary.updated_at
      }
    ];
    
    res.json({ data: history });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch summary history' });
  }
});

module.exports = router;