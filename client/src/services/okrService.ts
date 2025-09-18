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
  // Build objectives dynamically from summaries and work items
  async getOKRStructure(): Promise<Objective[]> {
    try {
      const [summaries, allWorkItems] = await Promise.all([
        summariesApi.getAll(),
        workItemsApi.getAll()
      ]);

      // Group work items by summary
      const workItemsBySummary = this.groupWorkItemsBySummary(allWorkItems);
      
      // Convert summaries to objectives with key results derived from work items
      const objectives: Objective[] = summaries.map(summary => ({
        id: `obj-${summary.id}`,
        title: summary.title,
        description: summary.description || '',
        owner: this.extractOwnerFromWorkItems(workItemsBySummary[summary.id] || []),
        quarter: this.determineQuarter(summary.created_at),
        keyResults: this.generateKeyResultsFromWorkItems(summary.id, workItemsBySummary[summary.id] || [])
      }));

      return objectives;
    } catch (error) {
      console.error('Error building OKR structure:', error);
      return [];
    }
  }

  private groupWorkItemsBySummary(workItems: WorkItem[]): Record<number, WorkItem[]> {
    return workItems.reduce((acc, item) => {
      if (!acc[item.summary_id]) {
        acc[item.summary_id] = [];
      }
      acc[item.summary_id].push(item);
      return acc;
    }, {} as Record<number, WorkItem[]>);
  }

  private extractOwnerFromWorkItems(workItems: WorkItem[]): string {
    // Extract the most common assignee or area path as owner
    const assignees = workItems
      .map(item => item.assigned_to)
      .filter((assignee): assignee is string => assignee != null && assignee.trim().length > 0);
    
    if (assignees.length === 0) {
      // Try to extract from area path
      const areaPaths = workItems
        .map(item => item.area_path)
        .filter((path): path is string => path != null && path.trim().length > 0);
      
      if (areaPaths.length > 0) {
        // Extract team name from area path (e.g., "Project\\Team" -> "Team")
        const pathParts = areaPaths[0].split('\\');
        const teamName = pathParts[pathParts.length - 1];
        return teamName || 'Unassigned Team';
      }
      
      return 'Unassigned Team';
    }
    
    // Return the most frequent assignee
    const assigneeCounts = assignees.reduce((acc, assignee) => {
      acc[assignee] = (acc[assignee] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostFrequentAssignee = Object.entries(assigneeCounts)
      .sort(([,a], [,b]) => b - a)[0][0];
    
    return mostFrequentAssignee;
  }

  private determineQuarter(createdAt: string): string {
    const date = new Date(createdAt);
    const month = date.getMonth() + 1; // 0-indexed to 1-indexed
    const year = date.getFullYear();
    
    let quarter: number;
    if (month <= 3) quarter = 1;
    else if (month <= 6) quarter = 2;
    else if (month <= 9) quarter = 3;
    else quarter = 4;
    
    return `Q${quarter} ${year}`;
  }

  private generateKeyResultsFromWorkItems(summaryId: number, workItems: WorkItem[]): KeyResult[] {
    if (workItems.length === 0) return [];

    // Group work items by type to create key results
    const workItemsByType = workItems.reduce((acc, item) => {
      const type = item.work_item_type || 'Task';
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(item);
      return acc;
    }, {} as Record<string, WorkItem[]>);

    const keyResults: KeyResult[] = [];

    Object.entries(workItemsByType).forEach(([type, items], index) => {
      const completedItems = items.filter(item => 
        item.state === 'Completed' || item.state === 'Done' || item.state === 'Closed'
      );
      
      const totalItems = items.length;
      const progress = totalItems > 0 ? Math.round((completedItems.length / totalItems) * 100) : 0;
      
      let status: KeyResult['status'];
      if (progress >= 100) status = 'completed';
      else if (progress >= 75) status = 'on-track';
      else if (progress >= 50) status = 'at-risk';
      else status = 'behind';

      const totalEffort = items.reduce((sum, item) => sum + (item.effort || 0), 0);
      const completedEffort = completedItems.reduce((sum, item) => sum + (item.effort || 0), 0);
      
      keyResults.push({
        id: `kr-${summaryId}-${index + 1}`,
        objectiveId: `obj-${summaryId}`,
        title: `Complete ${type} Items`,
        description: `Complete all ${type.toLowerCase()} items associated with this objective`,
        target: `${totalItems} ${type.toLowerCase()} items`,
        current: `${completedItems.length} completed`,
        progress,
        status,
        summary: this.generateKeyResultSummary(type, items, completedItems, totalEffort, completedEffort),
        workItems: items
      });
    });

    return keyResults;
  }

  private generateKeyResultSummary(
    type: string, 
    allItems: WorkItem[], 
    completedItems: WorkItem[], 
    totalEffort: number, 
    completedEffort: number
  ): string {
    const completionRate = allItems.length > 0 ? Math.round((completedItems.length / allItems.length) * 100) : 0;
    const effortRate = totalEffort > 0 ? Math.round((completedEffort / totalEffort) * 100) : 0;
    
    const activeItems = allItems.filter(item => item.state === 'Active').length;
    const inProgressItems = allItems.filter(item => 
      item.state === 'In Progress' || item.state === 'Development' || item.state === 'Testing'
    ).length;

    let summary = `${type} completion is at ${completionRate}% with ${completedItems.length} of ${allItems.length} items completed.`;
    
    if (effortRate > 0 && effortRate !== completionRate) {
      summary += ` Effort completion is at ${effortRate}%.`;
    }
    
    if (activeItems > 0) {
      summary += ` ${activeItems} items are currently active.`;
    }
    
    if (inProgressItems > 0) {
      summary += ` ${inProgressItems} items are in progress.`;
    }

    return summary;
  }

  async getExecutiveSummary(): Promise<ExecutiveSummary> {
    try {
      const objectives = await this.getOKRStructure();
      const allKeyResults = objectives.flatMap(obj => obj.keyResults);
      const allWorkItems = allKeyResults.flatMap(kr => kr.workItems);

      const objectivesOnTrack = objectives.filter(obj => {
        const avgProgress = obj.keyResults.length > 0 
          ? obj.keyResults.reduce((sum, kr) => sum + kr.progress, 0) / obj.keyResults.length 
          : 0;
        return avgProgress >= 70; // Consider 70%+ as "on track"
      }).length;

      const keyResultsCompleted = allKeyResults.filter(kr => kr.status === 'completed').length;
      const completedWorkItems = allWorkItems.filter(item => 
        item.state === 'Completed' || item.state === 'Done' || item.state === 'Closed'
      ).length;

      // Extract themes from work item tags and area paths
      const themes = this.extractMajorThemes(allWorkItems);
      
      // Generate executive notes based on actual data
      const executiveNotes = this.generateExecutiveNotes(objectives, allKeyResults, allWorkItems);

      const overallProgress = allKeyResults.length > 0 
        ? Math.round(allKeyResults.reduce((sum, kr) => sum + kr.progress, 0) / allKeyResults.length)
        : 0;

      // Determine quarter from most recent summary
      const quarter = objectives.length > 0 
        ? this.determineQuarter(new Date().toISOString()) 
        : 'Current Quarter';

      return {
        quarter,
        overallProgress,
        totalObjectives: objectives.length,
        objectivesOnTrack,
        objectivesAtRisk: objectives.length - objectivesOnTrack,
        totalKeyResults: allKeyResults.length,
        keyResultsCompleted,
        totalWorkItems: allWorkItems.length,
        completedWorkItems,
        majorThemes: themes,
        executiveNotes
      };
    } catch (error) {
      console.error('Error generating executive summary:', error);
      return {
        quarter: 'Current Quarter',
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

  private extractMajorThemes(workItems: WorkItem[]): string[] {
    const themes = new Set<string>();
    
    // Extract from tags
    workItems.forEach(item => {
      if (item.tags) {
        item.tags.split(',').forEach(tag => {
          const cleanTag = tag.trim();
          if (cleanTag.length > 0) {
            themes.add(cleanTag);
          }
        });
      }
      
      // Extract from area paths
      if (item.area_path) {
        const pathParts = item.area_path.split('\\');
        pathParts.forEach(part => {
          const cleanPart = part.trim();
          if (cleanPart.length > 0 && !cleanPart.includes('Project')) {
            themes.add(cleanPart);
          }
        });
      }
    });

    // Return top 5 most common themes
    return Array.from(themes).slice(0, 5);
  }

  private generateExecutiveNotes(objectives: Objective[], keyResults: KeyResult[], workItems: WorkItem[]): string[] {
    const notes: string[] = [];
    
    if (objectives.length === 0) {
      notes.push('No objectives currently defined. Consider creating summaries to establish OKR structure.');
      return notes;
    }

    // Overall progress note
    const avgProgress = Math.round(keyResults.reduce((sum, kr) => sum + kr.progress, 0) / keyResults.length);
    if (avgProgress >= 80) {
      notes.push(`Strong progress across all initiatives with ${avgProgress}% average completion rate.`);
    } else if (avgProgress >= 60) {
      notes.push(`Good momentum with ${avgProgress}% average progress, some areas may need attention.`);
    } else {
      notes.push(`Progress at ${avgProgress}% indicates need for focused effort and possible reprioritization.`);
    }

    // Work item insights
    const activeItems = workItems.filter(item => item.state === 'Active').length;
    if (activeItems > 0) {
      notes.push(`${activeItems} work items are currently active across ${objectives.length} objectives.`);
    }

    // Team/assignment insights
    const assignedItems = workItems.filter(item => item.assigned_to && item.assigned_to.trim().length > 0).length;
    const unassignedItems = workItems.length - assignedItems;
    if (unassignedItems > 0) {
      notes.push(`${unassignedItems} work items require assignment for improved ownership and accountability.`);
    }

    // Priority insights
    const highPriorityItems = workItems.filter(item => item.priority === 1).length;
    if (highPriorityItems > 0) {
      notes.push(`${highPriorityItems} high-priority items require immediate attention to maintain momentum.`);
    }

    return notes;
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
      .filter(item => item.state === 'Completed' || item.state === 'Done' || item.state === 'Closed')
      .reduce((sum, item) => sum + (item.effort || 0), 0);
    
    const totalBusinessValue = workItems.reduce((sum, item) => sum + (item.business_value || 0), 0);
    const activeWorkItems = workItems.filter(item => item.state === 'Active').length;
    const completedWorkItems = workItems.filter(item => 
      item.state === 'Completed' || item.state === 'Done' || item.state === 'Closed'
    ).length;
    
    const overallProgress = objective.keyResults.length > 0
      ? Math.round(objective.keyResults.reduce((sum, kr) => sum + kr.progress, 0) / objective.keyResults.length)
      : 0;

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