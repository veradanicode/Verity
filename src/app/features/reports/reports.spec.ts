import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Reports } from './reports';

import { ProjectService } from '../../core/services/project';
import { TaskService } from '../../core/services/task';

describe('Reports', () => {
  let component: Reports;
  let fixture: ComponentFixture<Reports>;

  let projectService: ProjectService;
  let taskService: TaskService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reports],
      providers: [ProjectService, TaskService],
    }).compileComponents();

    fixture = TestBed.createComponent(Reports);
    component = fixture.componentInstance;

    projectService = TestBed.inject(ProjectService);
    taskService = TestBed.inject(TaskService);

    fixture.detectChanges();
  });

  // --------------------------------------------------
  // COMPONENT CREATION
  // --------------------------------------------------

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // --------------------------------------------------
  // PROJECT STATISTICS
  // --------------------------------------------------

  it('should calculate project statistics', () => {
    expect(component.totalProjects).toBe(component.projects.length);

    expect(component.completedProjects).toBe(
      component.projects.filter((project) => project.status === 'Completed').length,
    );

    expect(component.activeProjects).toBe(component.totalProjects - component.completedProjects);
  });

  it('should calculate project completion rate', () => {
    const expectedRate =
      component.totalProjects === 0
        ? 0
        : Math.round((component.completedProjects / component.totalProjects) * 100);

    expect(component.projectCompletionRate).toBe(expectedRate);
  });

  it('should calculate average project progress', () => {
    const expectedProgress =
      component.totalProjects === 0
        ? 0
        : Math.round(
            component.projects.reduce((total, project) => total + project.progress, 0) /
              component.totalProjects,
          );

    expect(component.averageProjectProgress).toBe(expectedProgress);
  });

  // --------------------------------------------------
  // TASK STATISTICS
  // --------------------------------------------------

  it('should calculate task statistics', () => {
    expect(component.totalTasks).toBe(component.tasks.length);

    expect(component.completedTasks).toBe(
      component.tasks.filter((task) => task.status === 'Completed').length,
    );

    expect(component.pendingTasks).toBe(component.totalTasks - component.completedTasks);
  });

  it('should calculate task completion rate', () => {
    const expectedRate =
      component.totalTasks === 0
        ? 0
        : Math.round((component.completedTasks / component.totalTasks) * 100);

    expect(component.taskCompletionRate).toBe(expectedRate);
  });

  // --------------------------------------------------
  // FINANCIAL STATISTICS
  // --------------------------------------------------

  it('should calculate total budget', () => {
    const expectedBudget = component.projects.reduce((total, project) => total + project.budget, 0);

    expect(component.totalBudget).toBe(expectedBudget);
  });

  it('should calculate total spent', () => {
    const expectedSpent = component.projects.reduce((total, project) => total + project.spent, 0);

    expect(component.totalSpent).toBe(expectedSpent);
  });

  it('should calculate remaining budget', () => {
    expect(component.remainingBudget).toBe(component.totalBudget - component.totalSpent);
  });

  it('should calculate budget utilization', () => {
    const expectedUtilization =
      component.totalBudget === 0
        ? 0
        : Math.round((component.totalSpent / component.totalBudget) * 100);

    expect(component.budgetUtilization).toBe(expectedUtilization);
  });

  // --------------------------------------------------
  // PROJECT REPORTS
  // --------------------------------------------------

  it('should generate a report for every project', () => {
    expect(component.projectReports.length).toBe(component.projects.length);
  });

  it('should calculate project task completion', () => {
    component.projectReports.forEach((report) => {
      const projectTasks = component.tasks.filter((task) => task.projectId === report.project.id);

      const completedTasks = projectTasks.filter((task) => task.status === 'Completed').length;

      expect(report.completedTasks).toBe(completedTasks);

      expect(report.totalTasks).toBe(projectTasks.length);
    });
  });

  // --------------------------------------------------
  // PRIORITY REPORTS
  // --------------------------------------------------

  it('should generate priority statistics', () => {
    expect(component.priorityReports.length).toBe(3);

    const priorities = ['High', 'Medium', 'Low'];

    priorities.forEach((priority) => {
      const report = component.priorityReports.find((item) => item.name === priority);

      expect(report).toBeTruthy();

      const expectedCount = component.tasks.filter((task) => task.priority === priority).length;

      expect(report?.count).toBe(expectedCount);
    });
  });

  // --------------------------------------------------
  // DEADLINES
  // --------------------------------------------------

  it('should not count completed tasks as overdue', () => {
    const overdueTasks = component.tasks.filter(
      (task) =>
        task.status !== 'Completed' && task.dueDate < new Date().toISOString().split('T')[0],
    );

    expect(component.overdueTasks).toBe(overdueTasks.length);
  });

  it('should only include unfinished tasks in upcoming tasks', () => {
    component.upcomingTasks.forEach((item) => {
      expect(item.task.status).not.toBe('Completed');
    });
  });

  // --------------------------------------------------
  // DEADLINE LABELS
  // --------------------------------------------------

  it('should return the correct deadline label for overdue tasks', () => {
    expect(component.getDeadlineLabel(-1)).toBe('1 day overdue');

    expect(component.getDeadlineLabel(-3)).toBe('3 days overdue');
  });

  it('should return the correct deadline label for today', () => {
    expect(component.getDeadlineLabel(0)).toBe('Due today');
  });

  it('should return the correct deadline label for tomorrow', () => {
    expect(component.getDeadlineLabel(1)).toBe('Due tomorrow');
  });

  it('should return the correct deadline label for future dates', () => {
    expect(component.getDeadlineLabel(5)).toBe('5 days left');
  });

  // --------------------------------------------------
  // PRIORITY CLASS
  // --------------------------------------------------

  it('should return the correct priority CSS class', () => {
    expect(component.getPriorityClass('High')).toBe('high');

    expect(component.getPriorityClass('Medium')).toBe('medium');

    expect(component.getPriorityClass('Low')).toBe('low');
  });

  // --------------------------------------------------
  // REACTIVE TASK UPDATES
  // --------------------------------------------------

  it('should update reports when task data changes', () => {
    const initialTaskCount = component.totalTasks;

    const currentTasks = taskService.getTasks?.() ?? component.tasks;

    if (currentTasks.length > 0) {
      const updatedTasks = [
        ...currentTasks,
        {
          ...currentTasks[0],
          id: Date.now(),
        },
      ];

      taskService['tasksSubject']?.next(updatedTasks);

      fixture.detectChanges();

      expect(component.totalTasks).toBe(initialTaskCount + 1);
    }
  });
});
