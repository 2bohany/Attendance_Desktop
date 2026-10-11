import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import type { EmployeesRepository, EmployeeWithDepartment } from './employees.repository';
import type { DepartmentsRepository } from './departments.repository';
import type { Department } from '@prisma/client';

function buildEmployee(overrides: Partial<EmployeeWithDepartment> = {}): EmployeeWithDepartment {
  return {
    id: 'emp-1',
    employeeCode: 'EMP-0001',
    fullName: 'Jane Doe',
    email: null,
    phone: null,
    jobTitle: null,
    hireDate: new Date('2024-01-01'),
    isActive: true,
    notes: null,
    departmentId: null,
    department: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe('EmployeesService', () => {
  let employeesRepository: Pick<
    EmployeesRepository,
    'count' | 'create' | 'findById' | 'update' | 'setActive' | 'findMany'
  >;
  let departmentsRepository: Pick<DepartmentsRepository, 'findById'>;
  let service: EmployeesService;

  beforeEach(() => {
    employeesRepository = {
      count: vi.fn(),
      create: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      setActive: vi.fn(),
      findMany: vi.fn(),
    };
    departmentsRepository = { findById: vi.fn() };

    service = new EmployeesService(
      employeesRepository as unknown as EmployeesRepository,
      departmentsRepository as unknown as DepartmentsRepository,
    );
  });

  it('generates a zero-padded sequential employee code', async () => {
    vi.mocked(employeesRepository.count).mockResolvedValue(4);
    vi.mocked(employeesRepository.create).mockResolvedValue(buildEmployee({ employeeCode: 'EMP-0005' }));

    await service.create({
      fullName: 'Jane Doe',
      hireDate: '2024-01-01',
    });

    expect(employeesRepository.create).toHaveBeenCalledWith(
      'EMP-0005',
      expect.objectContaining({ fullName: 'Jane Doe' }),
    );
  });

  it('rejects creating an employee against a non-existent department', async () => {
    vi.mocked(departmentsRepository.findById).mockResolvedValue(null);

    await expect(
      service.create({ fullName: 'Jane Doe', hireDate: '2024-01-01', departmentId: 'missing-dept' }),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(employeesRepository.create).not.toHaveBeenCalled();
  });

  it('throws when updating an employee that does not exist', async () => {
    vi.mocked(employeesRepository.findById).mockResolvedValue(null);

    await expect(
      service.update('missing-id', { fullName: 'Jane Doe', hireDate: '2024-01-01' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('accepts a valid department when creating an employee', async () => {
    vi.mocked(departmentsRepository.findById).mockResolvedValue({ id: 'dept-1' } as Department);
    vi.mocked(employeesRepository.count).mockResolvedValue(0);
    vi.mocked(employeesRepository.create).mockResolvedValue(buildEmployee());

    await service.create({ fullName: 'Jane Doe', hireDate: '2024-01-01', departmentId: 'dept-1' });

    expect(employeesRepository.create).toHaveBeenCalledWith(
      'EMP-0001',
      expect.objectContaining({ departmentId: 'dept-1' }),
    );
  });
});
