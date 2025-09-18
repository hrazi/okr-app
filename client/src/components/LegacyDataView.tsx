import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  CardActionArea,
  Button,
  Collapse,
  Divider,
  Badge,
  Avatar
} from '@mui/material';
import {
  OpenInNew as OpenInNewIcon,
  Launch as LaunchIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { Summary, WorkItem } from '../types/api';

interface LegacyDataViewProps {
  summaries: Summary[];
  workItems: WorkItem[];
  selectedSummaryId: number | null;
  onSummaryClick: (summary: Summary) => void;
  onWorkItemClick: (workItem: WorkItem) => void;
  getStatusColor: (status: Summary['status']) => 'success' | 'warning' | 'default';
}

const LegacyDataView: React.FC<LegacyDataViewProps> = ({
  summaries,
  workItems,
  selectedSummaryId,
  onSummaryClick,
  onWorkItemClick,
  getStatusColor
}) => {
  const [expandedSummaries, setExpandedSummaries] = useState<Set<number>>(new Set());
  const [expandedWorkItems, setExpandedWorkItems] = useState<Set<number>>(new Set());

  const toggleSummaryExpansion = (summaryId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    const newExpanded = new Set(expandedSummaries);
    if (newExpanded.has(summaryId)) {
      newExpanded.delete(summaryId);
    } else {
      newExpanded.add(summaryId);
    }
    setExpandedSummaries(newExpanded);
  };

  const toggleWorkItemExpansion = (workItemId: number) => {
    const newExpanded = new Set(expandedWorkItems);
    if (newExpanded.has(workItemId)) {
      newExpanded.delete(workItemId);
    } else {
      newExpanded.add(workItemId);
    }
    setExpandedWorkItems(newExpanded);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getStatusIcon = (status: Summary['status']) => {
    switch (status) {
      case 'published': return '✅';
      case 'draft': return '📝';
      case 'archived': return '📦';
      default: return '❓';
    }
  };
  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom>
        Raw Data View
      </Typography>
      
      <Box display="flex" gap={3} flexDirection={{ xs: 'column', md: 'row' }}>
        {/* Summaries Section */}
        <Box flex={1}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" component="h3">
              Summaries
            </Typography>
            <Badge badgeContent={summaries.length} color="primary">
              <AssignmentIcon />
            </Badge>
          </Box>
          {summaries.map((summary) => (
            <Card 
              key={summary.id}
              sx={{ 
                mb: 2,
                border: selectedSummaryId === summary.id ? 2 : 1,
                borderColor: selectedSummaryId === summary.id ? 'primary.main' : 'divider',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  elevation: 4,
                  transform: 'translateY(-1px)',
                  borderColor: 'primary.light'
                }
              }}
            >
              <CardActionArea onClick={() => onSummaryClick(summary)}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box flex={1}>
                      <Typography 
                        variant="h6" 
                        component="h4"
                        sx={{ 
                          fontWeight: selectedSummaryId === summary.id ? 600 : 500,
                          color: selectedSummaryId === summary.id ? 'primary.main' : 'inherit'
                        }}
                      >
                        {summary.title}
                      </Typography>
                    </Box>
                    <Box display="flex" gap={1} alignItems="center">
                      <Tooltip title={`Status: ${summary.status}`}>
                        <Chip 
                          label={`${getStatusIcon(summary.status)} ${summary.status}`}
                          color={getStatusColor(summary.status)}
                          size="small"
                          clickable
                          sx={{ fontWeight: 500 }}
                        />
                      </Tooltip>
                      <IconButton 
                        size="small"
                        onClick={(e) => toggleSummaryExpansion(summary.id, e)}
                        sx={{ color: 'text.secondary' }}
                      >
                        {expandedSummaries.has(summary.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </Box>
                  </Box>
                  
                  {summary.description && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: expandedSummaries.has(summary.id) ? 'none' : 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        mb: 2,
                        lineHeight: 1.5
                      }}
                    >
                      {summary.description}
                    </Typography>
                  )}
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" gap={1}>
                      <ScheduleIcon fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        Created: {formatDate(summary.created_at)}
                      </Typography>
                    </Box>
                    
                    <Box display="flex" gap={1}>
                      <Tooltip title="View Details">
                        <IconButton size="small" color="primary">
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Summary">
                        <IconButton size="small" color="secondary">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  
                  <Collapse in={expandedSummaries.has(summary.id)}>
                    <Box mt={2} pt={2} borderTop={1} borderColor="divider">
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Version:</strong> {summary.version}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Last Updated:</strong> {formatDate(summary.updated_at)}
                      </Typography>
                    </Box>
                  </Collapse>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>

        {/* Work Items Section */}
        <Box flex={1}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
              <Typography variant="h5" component="h3">
                Work Items
              </Typography>
              {selectedSummaryId && (
                <Typography variant="caption" color="text.secondary">
                  📋 Showing items for selected summary
                </Typography>
              )}
            </Box>
            <Badge badgeContent={workItems.length} color="secondary">
              <AssignmentIcon />
            </Badge>
          </Box>
          
          {workItems.map((item) => (
            <Card 
              key={item.id} 
              sx={{ 
                mb: 2,
                border: 1,
                borderColor: 'divider',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  elevation: 3,
                  transform: 'translateY(-1px)',
                  borderColor: 'secondary.light'
                }
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box flex={1}>
                    <Typography 
                      variant="h6" 
                      component="h4" 
                      sx={{ 
                        fontWeight: 500,
                        mb: 1,
                        cursor: 'pointer',
                        '&:hover': { color: 'primary.main' }
                      }}
                      onClick={() => onWorkItemClick(item)}
                    >
                      {item.title}
                    </Typography>
                  </Box>
                  <Box display="flex" gap={1} alignItems="center">
                    <Tooltip title={`Work item type: ${item.work_item_type || 'Task'}`}>
                      <Chip 
                        label={item.work_item_type || 'Task'} 
                        color="primary" 
                        size="small" 
                        variant="outlined"
                        clickable
                      />
                    </Tooltip>
                    <IconButton 
                      size="small"
                      onClick={() => toggleWorkItemExpansion(item.id)}
                      sx={{ color: 'text.secondary' }}
                    >
                      {expandedWorkItems.has(item.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Box>
                </Box>
                
                {item.description && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: expandedWorkItems.has(item.id) ? 'none' : 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mb: 2,
                      lineHeight: 1.5,
                      cursor: 'pointer'
                    }}
                    onClick={() => toggleWorkItemExpansion(item.id)}
                  >
                    {item.description}
                  </Typography>
                )}
                
                <Divider sx={{ my: 1 }} />
                
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Box display="flex" alignItems="center" gap={2}>
                    {item.state && (
                      <Tooltip title={`State: ${item.state}`}>
                        <Chip 
                          label={item.state}
                          size="small"
                          color={item.state === 'Active' ? 'success' : 'default'}
                          clickable
                        />
                      </Tooltip>
                    )}
                    {item.assigned_to && (
                      <Tooltip title={`Assigned to: ${item.assigned_to}`}>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <PersonIcon fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            {item.assigned_to}
                          </Typography>
                        </Box>
                      </Tooltip>
                    )}
                  </Box>
                  
                  <Box display="flex" gap={1}>
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => toggleWorkItemExpansion(item.id)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Open in Azure DevOps">
                      <IconButton 
                        size="small" 
                        onClick={() => onWorkItemClick(item)}
                        color="secondary"
                      >
                        <OpenInNewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                
                {item.tags && (
                  <Box display="flex" gap={1} flexWrap="wrap" mb={1}>
                    {item.tags.split(',').map((tag, index) => (
                      <Tooltip key={index} title={`Tag: ${tag.trim()}`}>
                        <Chip 
                          label={tag.trim()}
                          size="small"
                          variant="outlined"
                          color="secondary"
                          clickable
                          sx={{ fontSize: '0.7rem' }}
                        />
                      </Tooltip>
                    ))}
                  </Box>
                )}
                
                <Collapse in={expandedWorkItems.has(item.id)}>
                  <Box mt={2} pt={2} borderTop={1} borderColor="divider">
                    <Box display="flex" flexWrap="wrap" gap={2}>
                      {item.area_path && (
                        <Typography variant="body2" color="text.secondary">
                          <strong>Area:</strong> {item.area_path}
                        </Typography>
                      )}
                      {item.iteration_path && (
                        <Typography variant="body2" color="text.secondary">
                          <strong>Iteration:</strong> {item.iteration_path}
                        </Typography>
                      )}
                      {item.priority !== undefined && (
                        <Typography variant="body2" color="text.secondary">
                          <strong>Priority:</strong> {item.priority}
                        </Typography>
                      )}
                      {item.effort !== undefined && (
                        <Typography variant="body2" color="text.secondary">
                          <strong>Effort:</strong> {item.effort}
                        </Typography>
                      )}
                      {item.business_value !== undefined && (
                        <Typography variant="body2" color="text.secondary">
                          <strong>Business Value:</strong> {item.business_value}
                        </Typography>
                      )}
                    </Box>
                    {(item.created_date || item.changed_date) && (
                      <Box mt={1} pt={1} borderTop={1} borderColor="divider">
                        {item.created_date && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            Created: {formatDate(item.created_date)}
                          </Typography>
                        )}
                        {item.changed_date && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            Last Changed: {formatDate(item.changed_date)}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Box>
                </Collapse>
              </CardContent>
            </Card>
          ))}
          
          {workItems.length === 0 && (
            <Box 
              display="flex" 
              flexDirection="column" 
              alignItems="center" 
              justifyContent="center" 
              p={4}
              sx={{ 
                border: 1, 
                borderColor: 'divider', 
                borderRadius: 1,
                backgroundColor: 'background.paper'
              }}
            >
              <AssignmentIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" color="text.secondary" align="center">
                {selectedSummaryId ? 
                  'No work items found for the selected summary.' : 
                  'Select a summary to view its work items.'
                }
              </Typography>
              {!selectedSummaryId && (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                  Click on a summary card to load its associated work items.
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default LegacyDataView;