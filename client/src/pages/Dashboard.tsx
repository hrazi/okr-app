import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  CardActionArea,
  Tabs,
  Tab
} from '@mui/material';
import {
  OpenInNew as OpenInNewIcon,
  Launch as LaunchIcon
} from '@mui/icons-material';
import { Summary, WorkItem } from '../types/api';
import type { Objective, ExecutiveSummary } from '../types/okr';
import { summariesApi, workItemsApi } from '../services/api';
import { okrService } from '../services/okrService';
import ExecutiveSummaryComponent from '../components/ExecutiveSummary';
import OKRVisualization from '../components/OKRVisualization';
import LegacyDataView from '../components/LegacyDataView';

const Dashboard: React.FC = () => {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [executiveSummary, setExecutiveSummary] = useState<ExecutiveSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSummaryId, setSelectedSummaryId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  // Azure DevOps configuration - Update these with your organization details
  const ADO_ORGANIZATION = 'skype'; // Replace with your ADO organization
  const ADO_PROJECT = 'SBS'; // Replace with your project name

  useEffect(() => {
    loadData();
  }, []);

  const constructAdoUrl = (workItemId: number): string => {
    return `https://dev.azure.com/${ADO_ORGANIZATION}/${ADO_PROJECT}/_workitems/edit/${workItemId}`;
  };

  const handleWorkItemClick = (workItem: WorkItem) => {
    const url = constructAdoUrl(workItem.id);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSummaryClick = async (summary: Summary) => {
    try {
      setSelectedSummaryId(summary.id);
      const workItemsData = await workItemsApi.getBySummary(summary.id);
      setWorkItems(workItemsData);
    } catch (err) {
      setError('Failed to load work items for this summary');
      console.error('Error loading work items:', err);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load all data in parallel
      const [summariesData, objectivesData, execSummary] = await Promise.all([
        summariesApi.getAll(),
        okrService.getOKRStructure(),
        okrService.getExecutiveSummary()
      ]);
      
      setSummaries(summariesData);
      setObjectives(objectivesData);
      setExecutiveSummary(execSummary);
      
      // Load work items for the first summary
      if (summariesData.length > 0) {
        const firstSummary = summariesData[0];
        setSelectedSummaryId(firstSummary.id);
        const workItemsData = await workItemsApi.getBySummary(firstSummary.id);
        setWorkItems(workItemsData);
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Summary['status']) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'warning';
      case 'archived': return 'default';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        IC3 Infrastructure & Core Components
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress size={60} />
        </Box>
      ) : (
        <>
          {/* Tab Navigation */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="Executive Summary" />
              <Tab label="OKR Structure" />
              <Tab label="Raw Data View" />
            </Tabs>
          </Box>

          {/* Tab Content */}
          {activeTab === 0 && executiveSummary && (
            <ExecutiveSummaryComponent summary={executiveSummary} />
          )}

          {activeTab === 1 && (
            <OKRVisualization 
              objectives={objectives} 
              onWorkItemClick={handleWorkItemClick}
            />
          )}

          {activeTab === 2 && (
            <LegacyDataView 
              summaries={summaries}
              workItems={workItems}
              selectedSummaryId={selectedSummaryId}
              onSummaryClick={handleSummaryClick}
              onWorkItemClick={handleWorkItemClick}
              getStatusColor={getStatusColor}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default Dashboard;