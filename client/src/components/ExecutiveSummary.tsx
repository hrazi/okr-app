import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Insights as InsightsIcon
} from '@mui/icons-material';
import type { ExecutiveSummary } from '../types/okr';

interface ExecutiveSummaryProps {
  summary: ExecutiveSummary;
}

const ExecutiveSummaryComponent: React.FC<ExecutiveSummaryProps> = ({ summary }) => {
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'success';
    if (progress >= 60) return 'primary';
    if (progress >= 40) return 'warning';
    return 'error';
  };

  const formatPercentage = (numerator: number, denominator: number) => {
    if (denominator === 0) return '0%';
    return `${Math.round((numerator / denominator) * 100)}%`;
  };

  return (
    <Box sx={{ mb: 4 }}>
      {/* Header */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', color: 'white' }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <InsightsIcon sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold">
                IC3 OKR Executive Summary
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Infrastructure & Core Components • {summary.quarter}
              </Typography>
            </Box>
          </Box>
          
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h6">Overall Progress:</Typography>
            <Box sx={{ flex: 1, maxWidth: 300 }}>
              <LinearProgress 
                variant="determinate" 
                value={summary.overallProgress} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: summary.overallProgress >= 70 ? '#4caf50' : summary.overallProgress >= 50 ? '#ff9800' : '#f44336'
                  }
                }} 
              />
            </Box>
            <Typography variant="h6" fontWeight="bold">
              {summary.overallProgress}%
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Box display="flex" gap={3} sx={{ mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 250px', minWidth: 250 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUpIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="primary">
                {summary.objectivesOnTrack}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                of {summary.totalObjectives} Objectives On Track
              </Typography>
              <Typography variant="h6" color="success.main" sx={{ mt: 1 }}>
                {formatPercentage(summary.objectivesOnTrack, summary.totalObjectives)}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 250px', minWidth: 250 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AssignmentIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="secondary">
                {summary.keyResultsCompleted}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                of {summary.totalKeyResults} Key Results Completed
              </Typography>
              <Typography variant="h6" color="info.main" sx={{ mt: 1 }}>
                {formatPercentage(summary.keyResultsCompleted, summary.totalKeyResults)}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 250px', minWidth: 250 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {summary.completedWorkItems}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                of {summary.totalWorkItems} Work Items Completed
              </Typography>
              <Typography variant="h6" color="success.main" sx={{ mt: 1 }}>
                {formatPercentage(summary.completedWorkItems, summary.totalWorkItems)}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 250px', minWidth: 250 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <WarningIcon sx={{ fontSize: 40, color: summary.objectivesAtRisk > 0 ? 'warning.main' : 'success.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" color={summary.objectivesAtRisk > 0 ? 'warning.main' : 'success.main'}>
                {summary.objectivesAtRisk}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Objectives At Risk
              </Typography>
              <Typography variant="h6" color={summary.objectivesAtRisk > 0 ? 'warning.main' : 'success.main'} sx={{ mt: 1 }}>
                {summary.objectivesAtRisk === 0 ? 'All On Track!' : 'Needs Attention'}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Major Themes */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Major Themes & Focus Areas
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {summary.majorThemes.map((theme, index) => (
              <Chip 
                key={index}
                label={theme}
                color="primary"
                variant="outlined"
                sx={{ fontSize: '0.875rem' }}
              />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Executive Notes */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Executive Commentary
          </Typography>
          <List>
            {summary.executiveNotes.map((note, index) => (
              <ListItem key={index} sx={{ px: 0 }}>
                <ListItemIcon>
                  <InsightsIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary={note}
                  primaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Status Alert */}
      {summary.overallProgress >= 70 ? (
        <Alert severity="success" sx={{ mt: 2 }}>
          <strong>Excellent Progress!</strong> IC3 OKRs are on track with {summary.overallProgress}% completion. 
          Strong execution across infrastructure reliability, performance optimization, and platform scalability initiatives.
        </Alert>
      ) : summary.overallProgress >= 50 ? (
        <Alert severity="warning" sx={{ mt: 2 }}>
          <strong>Good Progress with Areas for Focus.</strong> While overall progress is solid at {summary.overallProgress}%, 
          some key results may need additional attention to ensure Q3 targets are met.
        </Alert>
      ) : (
        <Alert severity="error" sx={{ mt: 2 }}>
          <strong>Action Required.</strong> Progress at {summary.overallProgress}% indicates significant challenges. 
          Immediate focus and potential scope adjustments may be needed to achieve critical infrastructure goals.
        </Alert>
      )}
    </Box>
  );
};

export default ExecutiveSummaryComponent;