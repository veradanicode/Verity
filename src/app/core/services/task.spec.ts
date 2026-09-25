import { TestBed } from '@angular/core/testing';

import { Task } from './task';
import { TaskService } from './task';

describe('Task', () => {
  let service: Task;
describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Task);
    service = TestBed.inject(TaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
