import { TestBed } from '@angular/core/testing';

import { Project } from './project';
import { ProjectService } from './project';

describe('Project', () => {
  let service: Project;
describe('ProjectService', () => {
  let service: ProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Project);
    service = TestBed.inject(ProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
