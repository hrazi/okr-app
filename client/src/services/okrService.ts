import { summariesApi, workItemsApi } from './api';
import type { 
  Objective, 
  KeyResult, 
  ExecutiveSummary, 
  OKRProgress,
  WorkItem,
  Summary 
} from '../types/okr';

class OKRService {
  // Static OKR structure based on IC3 infrastructure goals
  private static IC3_OBJECTIVES: Omit<Objective, 'keyResults'>[] = [
    {
      id: 'obj-1',
      title: 'Enhance Infrastructure Reliability & Performance',
      description: 'Improve system reliability, reduce downtime, and optimize performance across all IC3 infrastructure components',
      owner: 'IC3 Infrastructure Team',
      quarter: 'Q3 2025'
    },
    {
      id: 'obj-2', 
      title: 'Scale Platform for Future Growth',
      description: 'Build scalable architecture and monitoring capabilities to support increased user load and feature expansion',
      owner: 'Platform Engineering Team',
      quarter: 'Q3 2025'
    },
    {
      id: 'obj-3',
      title: 'Optimize Core Components Performance',
      description: 'Enhance messaging, calling, and core platform components for better user experience and resource efficiency',
      owner: 'Core Components Team', 
      quarter: 'Q3 2025'
    }
  ];

  private static KEY_RESULTS_MAPPING: Omit<KeyResult, 'workItems'>[] = [
    // Objective 1: Infrastructure Reliability
    {
      id: 'kr-1-1',
      objectiveId: 'obj-1',
      title: 'Achieve 99.9% System Uptime',
      description: 'Maintain system availability above 99.9% with less than 8.76 hours downtime per month',
      target: '99.9% uptime',
      current: '99.7% uptime',
      progress: 85,
      status: 'on-track',
      summary: 'Infrastructure reliability improvements are showing strong progress with uptime increasing from 99.5% to 99.7%. Key initiatives include automated failover systems and enhanced monitoring. Current trajectory suggests we will achieve the 99.9% target by end of Q3.'
    },
    {
      id: 'kr-1-2', 
      objectiveId: 'obj-1',
      title: 'Reduce Average Response Time by 25%',
      description: 'Optimize infrastructure to achieve sub-200ms average response times across all services',
      target: '< 200ms avg response',
      current: '245ms avg response',
      progress: 70,
      status: 'on-track',
      summary: 'Performance optimization efforts have reduced average response times from 320ms to 245ms, representing a 23% improvement. Database query optimization and CDN improvements are the primary drivers. Additional caching strategies are planned to reach the final target.'
    },

    // Objective 2: Platform Scalability  
    {
      id: 'kr-2-1',
      objectiveId: 'obj-2', 
      title: 'Implement Horizontal Scaling for 3x Load Capacity',
      description: 'Deploy auto-scaling infrastructure to handle 300% current peak load',
      target: '3x load capacity',
      current: '2.1x load capacity', 
      progress: 70,
      status: 'on-track',
      summary: 'Platform scalability initiatives have successfully increased load handling capacity from 1x to 2.1x baseline. Container orchestration and load balancing improvements are key contributors. Auto-scaling policies are being fine-tuned to achieve the final 3x target capacity.'
    },
    {
      id: 'kr-2-2',
      objectiveId: 'obj-2',
      title: 'Deploy Advanced Monitoring & Analytics Dashboard',
      description: 'Implement comprehensive monitoring with real-time analytics and predictive alerting',
      target: '100% service coverage',
      current: '75% service coverage',
      progress: 75,
      status: 'on-track', 
      summary: 'Advanced monitoring deployment is progressing well with 75% of services now covered by enhanced analytics. Real-time dashboards are operational for critical services. Predictive alerting algorithms are being calibrated to reduce false positives while maintaining early detection capabilities.'
    },

    // Objective 3: Core Components Performance
    {
      id: 'kr-3-1',
      objectiveId: 'obj-3',
      title: 'Optimize Memory Usage by 30%',
      description: 'Reduce memory footprint across messaging and calling components',
      target: '30% memory reduction',
      current: '18% memory reduction',
      progress: 60,
      status: 'on-track',
      summary: 'Memory optimization efforts have achieved an 18% reduction in memory usage across core components. Object pooling and garbage collection tuning are primary contributors. Additional optimizations in message queuing and session management are planned to reach the 30% target.'
    },
    {
      id: 'kr-3-2',
      objectiveId: 'obj-3', 
      title: 'Improve Network Efficiency by 20%',
      description: 'Optimize network protocols and data compression for better bandwidth utilization',
      target: '20% bandwidth reduction',
      current: '12% bandwidth reduction',
      progress: 60,
      status: 'on-track',
      summary: 'Network efficiency improvements have reduced bandwidth usage by 12% through protocol optimizations and enhanced compression algorithms. Message batching and connection pooling strategies are showing positive results. Further improvements in streaming protocols are expected to achieve the 20% target.'
    }
  ];

  async getOKRStructure(): Promise<Objective[]> {
    try {
      const [summaries, allWorkItems] = await Promise.all([
        summariesApi.getAll(),
        workItemsApi.getAll()
      ]);

      return OKRService.IC3_OBJECTIVES.map(objective => ({
        ...objective,
        keyResults: OKRService.KEY_RESULTS_MAPPING
          .filter(kr => kr.objectiveId === objective.id)
          .map(keyResult => ({
            ...keyResult,
            workItems: this.mapWorkItemsToKeyResult(keyResult.id, allWorkItems)
          }))
      }));
    } catch (error) {
      console.error('Error building OKR structure:', error);
      return [];
    }
  }

  private mapWorkItemsToKeyResult(keyResultId: string, allWorkItems: WorkItem[]): WorkItem[] {
    // Map work items to key results based on themes and areas
    const mappings: Record<string, number[]> = {
      'kr-1-1': [4111695], // Infrastructure Reliability -> uptime
      'kr-1-2': [4111695], // Infrastructure Reliability -> performance 
      'kr-2-1': [4213334], // Platform Scalability -> scaling
      'kr-2-2': [4213334], // Platform Scalability -> monitoring
      'kr-3-1': [4115742], // Core Components -> memory optimization
      'kr-3-2': [4115742], // Core Components -> network efficiency
    };

    const workItemIds = mappings[keyResultId] || [];
    return allWorkItems.filter(item => workItemIds.includes(item.id));
  }

  async getExecutiveSummary(): Promise<ExecutiveSummary> {
    try {
      const objectives = await this.getOKRStructure();
      const allKeyResults = objectives.flatMap(obj => obj.keyResults);
      const allWorkItems = allKeyResults.flatMap(kr => kr.workItems);

      const objectivesOnTrack = objectives.filter(obj => 
        obj.keyResults.every(kr => kr.status === 'on-track' || kr.status === 'completed')
      ).length;

      const keyResultsCompleted = allKeyResults.filter(kr => kr.status === 'completed').length;
      const completedWorkItems = allWorkItems.filter(item => item.state === 'Completed' || item.state === 'Done').length;

      const majorThemes = [
        'Infrastructure Reliability', 
        'Performance Optimization', 
        'Platform Scalability',
        'Monitoring & Analytics',
        'Resource Efficiency'
      ];

      const executiveNotes = [
        'Q3 2025 IC3 infrastructure initiatives are progressing well with strong momentum across all key areas.',
        'Performance improvements are exceeding expectations with 23% response time reduction already achieved.',
        'Platform scalability efforts have successfully increased capacity to 2.1x baseline, positioning us well for future growth.',
        'Cross-team collaboration on monitoring and analytics is delivering enhanced operational visibility.',
        'Resource optimization initiatives are showing measurable results in both memory and network efficiency.'
      ];

      const overallProgress = Math.round(
        allKeyResults.reduce((sum, kr) => sum + kr.progress, 0) / allKeyResults.length
      );

      return {
        quarter: 'Q3 2025',
        overallProgress,
        totalObjectives: objectives.length,
        objectivesOnTrack,
        objectivesAtRisk: objectives.length - objectivesOnTrack,
        totalKeyResults: allKeyResults.length,
        keyResultsCompleted,
        totalWorkItems: allWorkItems.length,
        completedWorkItems,
        majorThemes,
        executiveNotes
      };
    } catch (error) {
      console.error('Error generating executive summary:', error);
      return {
        quarter: 'Q3 2025',
        overallProgress: 0,
        totalObjectives: 0,
        objectivesOnTrack: 0,
        objectivesAtRisk: 0,
        totalKeyResults: 0,
        keyResultsCompleted: 0,
        totalWorkItems: 0,
        completedWorkItems: 0,
        majorThemes: [],
        executiveNotes: []
      };
    }
  }

  async getProgress(objectiveId: string): Promise<OKRProgress> {
    const objectives = await this.getOKRStructure();
    const objective = objectives.find(obj => obj.id === objectiveId);
    
    if (!objective) {
      throw new Error(`Objective ${objectiveId} not found`);
    }

    const workItems = objective.keyResults.flatMap(kr => kr.workItems);
    const totalEffort = workItems.reduce((sum, item) => sum + (item.effort || 0), 0);
    const completedEffort = workItems
      .filter(item => item.state === 'Completed' || item.state === 'Done')
      .reduce((sum, item) => sum + (item.effort || 0), 0);
    
    const totalBusinessValue = workItems.reduce((sum, item) => sum + (item.business_value || 0), 0);
    const activeWorkItems = workItems.filter(item => item.state === 'Active').length;
    const completedWorkItems = workItems.filter(item => item.state === 'Completed' || item.state === 'Done').length;
    
    const overallProgress = Math.round(
      objective.keyResults.reduce((sum, kr) => sum + kr.progress, 0) / objective.keyResults.length
    );

    const themes = Array.from(new Set(
      workItems.flatMap(item => (item.tags || '').split(',').map(tag => tag.trim()))
    )).filter(theme => theme.length > 0);

    return {
      objectiveId,
      totalEffort,
      completedEffort,
      totalBusinessValue,
      activeWorkItems,
      completedWorkItems,
      overallProgress,
      themes
    };
  }
}

export const okrService = new OKRService();