import type { Department, Employee } from '@attendance/shared';
import type { DepartmentWithCount } from './departments.repository';
import type { EmployeeWithDepartment } from './employees.repository';

export function toDepartment(department: DepartmentWithCount): Department {
  return {
    id: department.id,
    name: department.name,
    description: department.description,
    employeeCount: department._count.employees,
  };
}

export function toEmployee(employee: EmployeeWithDepartment): Employee {
  return {
    id: employee.id,
    employeeCode: employee.employeeCode,
    fullName: employee.fullName,
    email: employee.email,
    phone: employee.phone,
    jobTitle: employee.jobTitle,
    hireDate: employee.hireDate.toISOString(),
    isActive: employee.isActive,
    notes: employee.notes,
    department: employee.department
      ? { id: employee.department.id, name: employee.department.name }
      : null,
  };
}
