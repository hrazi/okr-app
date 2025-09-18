import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
  CardActionArea
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Flag as FlagIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  OpenInNew as OpenInNewIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import type { Objective, KeyResult, WorkItem } from '../types/okr';

interface OKRVisualizationProps {
  objectives: Objective[];
  onWorkItemClick?: (workItem: WorkItem) => void;
}

const OKRVisualization: React.FC<OKRVisualizationProps> = ({ 
  objectives, 
  onWorkItemClick 
}) => {
  const getStatusIcon = (status: KeyResult['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon sx={{ color: 'success.main' }} />;
      case 'on-track':
        return <TrendingUpIcon sx={{ color: 'success.main' }} />;
      case 'at-risk':
        return <WarningIcon sx={{ color: 'warning.main' }} />;
      case 'behind':
        return <ScheduleIcon sx={{ color: 'error.main' }} />;
      default:
        return <AssignmentIcon sx={{ color: 'grey.500' }} />;
    }
  };

  const getStatusColor = (status: KeyResult['status']) => {
    switch (status) {
      case 'completed': return 'success';
      case 'on-track': return 'success';
      case 'at-risk': return 'warning';
      case 'behind': return 'error';
      default: return 'default';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'success';
    if (progress >= 60) return 'primary';
    if (progress >= 40) return 'warning';
    return 'error';
  };

  const getWorkItemStateColor = (state: string) => {
    switch (state?.toLowerCase()) {
      case 'completed':
      case 'done':
        return 'success';
      case 'active':
      case 'in progress':
        return 'primary';
      case 'new':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
        📋 OKR Structure & Progress
      </Typography>

      {objectives.map((objective) => (
        <Card key={objective.id} sx={{ mb: 3, border: '2px solid', borderColor: 'primary.main' }}>
          <CardContent>
            {/* Objective Header */}
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <FlagIcon sx={{ fontSize: 32, color: 'primary.main' }} />
              <Box flex={1}>
                <Typography variant="h5" component="h3" fontWeight="bold" color="primary">
                  {objective.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  {objective.description}
                </Typography>
                <Box display="flex" gap={2} mt={1}>
                  <Chip label={objective.owner} size="small" color="primary" variant="outlined" />
                  <Chip label={objective.quarter} size="small" color="secondary" variant="outlined" />
                </Box>
              </Box>
            </Box>

            {/* Key Results */}
            <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2 }}>
              Key Results ({objective.keyResults.length})
            </Typography>

            {objective.keyResults.map((keyResult) => (
              <Accordion key={keyResult.id} sx={{ mb: 2 }}>
                <AccordionSummary 
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ 
                    '&:hover': { backgroundColor: 'action.hover' },
                    '& .MuiAccordionSummary-content': { alignItems: 'center' }
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2} width="100%">
                    {getStatusIcon(keyResult.status)}
                    <Box flex={1}>
                      <Typography variant="h6" fontSize="1.1rem">
                        {keyResult.title}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={2} mt={1}>
                        <Box sx={{ flex: 1, maxWidth: 200 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={keyResult.progress} 
                            color={getProgressColor(keyResult.progress)}
                            sx={{ height: 6, borderRadius: 3 }}
                          />
                        </Box>
                        <Typography variant="body2" fontWeight="bold">
                          {keyResult.progress}%
                        </Typography>
                        <Chip 
                          label={keyResult.status} 
                          size="small" 
                          color={getStatusColor(keyResult.status)}
                        />
                      </Box>
                    </Box>
                  </Box>
                </AccordionSummary>

                <AccordionDetails>
                  {/* Key Result Details */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body1" paragraph>
                      <strong>Description:</strong> {keyResult.description}
                    </Typography>
                    
                    <Box display="flex" gap={4} mb={2}>
                      <Typography variant="body2">
                        <strong>Target:</strong> {keyResult.target}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Current:</strong> {keyResult.current}
                      </Typography>
                    </Box>

                    <Card sx={{ p: 2, backgroundColor: 'grey.50', mb: 3 }}>
                      <Typography variant="body2" fontStyle="italic">
                        <strong>Summary:</strong> {keyResult.summary}
                      </Typography>
                    </Card>
                  </Box>

                  {/* Associated Work Items */}
                  <Typography variant="h6" gutterBottom>
                    Associated Work Items ({keyResult.workItems.length})
                  </Typography>

                  {keyResult.workItems.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                      No work items associated with this key result.
                    </Typography>
                  ) : (
                    <Box display="flex" flexDirection="column" gap={2}>
                      {keyResult.workItems.map((workItem) => (
                        <Card 
                          key={workItem.id}
                          sx={{ 
                            p: 2,
                            cursor: onWorkItemClick ? 'pointer' : 'default',
                            transition: 'all 0.2s ease',
                            '&:hover': onWorkItemClick ? {
                              transform: 'translateY(-1px)',
                              boxShadow: 2,
                              backgroundColor: 'action.hover'
                            } : {}
                          }}
                        >
                          {onWorkItemClick ? (
                            <CardActionArea onClick={() => onWorkItemClick(workItem)}>
                              <Box p={1}>
                                <WorkItemContent workItem={workItem} />
                              </Box>
                            </CardActionArea>
                          ) : (
                            <WorkItemContent workItem={workItem} />
                          )}
                        </Card>
                      ))}
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </CardContent>
        </Card>
      ))}

      {objectives.length === 0 && (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <AssignmentIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No OKR objectives available
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Start the backend server to load IC3 OKR data
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

// Separate component for work item content to avoid duplication
const WorkItemContent: React.FC<{ workItem: WorkItem }> = ({ workItem }) => {
  const getWorkItemStateColor = (state: string) => {
    switch (state?.toLowerCase()) {
      case 'completed':
      case 'done':
        return 'success';
      case 'active':
      case 'in progress':
        return 'primary';
      case 'new':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
        <Typography variant="body1" fontWeight="medium" sx={{ flex: 1 }}>
          {workItem.title}
          <OpenInNewIcon sx={{ fontSize: 16, ml: 1, color: 'primary.main' }} />
        </Typography>
        <Chip 
          label={workItem.state} 
          size="small" 
          color={getWorkItemStateColor(workItem.state || '')}
        />
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {workItem.description}
      </Typography>
      
      <Box display="flex" gap={1} flexWrap="wrap" mb={1}>
        <Chip label={workItem.work_item_type} size="small" variant="outlined" />
        {workItem.assigned_to && (
          <Chip label={workItem.assigned_to} size="small" variant="outlined" color="secondary" />
        )}
        {workItem.effort && (
          <Chip label={`${workItem.effort} pts`} size="small" variant="outlined" color="info" />
        )}
        {workItem.business_value && (
          <Chip label={`Value: ${workItem.business_value}`} size="small" variant="outlined" color="success" />
        )}
      </Box>
      
      <Typography variant="caption" color="text.secondary">
        ID: {workItem.id} • Priority: {workItem.priority} • Area: {workItem.area_path?.split('\\').pop()}
      </Typography>
    </>
  );
};

export default OKRVisualization;