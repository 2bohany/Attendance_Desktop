import type { Locale } from '@attendance/shared';

type TranslationKeys = {
  'app.name': string;
  'app.tagline': string;
  'nav.dashboard': string;
  'nav.employees': string;
  'nav.attendance': string;
  'nav.users': string;
  'nav.leaves': string;
  'nav.holidays': string;
  'nav.reports': string;
  'nav.settings': string;
  'nav.backup': string;
  'page.dashboard.title': string;
  'page.dashboard.description': string;
  'page.comingSoon': string;
  'page.comingSoonDescription': string;
  'status.connected': string;
  'status.disconnected': string;
  'status.checking': string;
  'topbar.toggleTheme': string;
  'topbar.toggleLanguage': string;
  'empty.title': string;
  'empty.description': string;
  'error.title': string;
  'error.description': string;
  'error.retry': string;
  'common.cancel': string;
  'common.save': string;
  'common.create': string;
  'common.loading': string;
  'auth.setup.title': string;
  'auth.setup.description': string;
  'auth.login.title': string;
  'auth.login.description': string;
  'auth.field.username': string;
  'auth.field.email': string;
  'auth.field.fullName': string;
  'auth.field.password': string;
  'auth.field.role': string;
  'auth.action.createAccount': string;
  'auth.action.signIn': string;
  'auth.action.signOut': string;
  'auth.loggedInAs': string;
  'users.title': string;
  'users.description': string;
  'users.tab.users': string;
  'users.tab.roles': string;
  'users.table.username': string;
  'users.table.fullName': string;
  'users.table.email': string;
  'users.table.role': string;
  'users.table.status': string;
  'users.table.lastLogin': string;
  'users.table.actions': string;
  'users.status.active': string;
  'users.status.inactive': string;
  'users.action.createUser': string;
  'users.action.edit': string;
  'users.action.deactivate': string;
  'users.action.activate': string;
  'users.createDialog.title': string;
  'users.createDialog.description': string;
  'users.editDialog.title': string;
  'users.editDialog.description': string;
  'users.editDialog.passwordHint': string;
  'users.field.newPassword': string;
  'users.neverLoggedIn': string;
  'roles.title': string;
  'roles.description': string;
  'roles.action.createRole': string;
  'roles.createDialog.title': string;
  'roles.createDialog.description': string;
  'roles.field.name': string;
  'roles.field.description': string;
  'roles.field.permissions': string;
  'roles.systemBadge': string;
  'employees.title': string;
  'employees.description': string;
  'employees.tab.employees': string;
  'employees.tab.departments': string;
  'employees.table.code': string;
  'employees.table.fullName': string;
  'employees.table.email': string;
  'employees.table.phone': string;
  'employees.table.jobTitle': string;
  'employees.table.department': string;
  'employees.table.hireDate': string;
  'employees.table.status': string;
  'employees.table.actions': string;
  'employees.status.active': string;
  'employees.status.inactive': string;
  'employees.action.createEmployee': string;
  'employees.action.edit': string;
  'employees.action.deactivate': string;
  'employees.action.activate': string;
  'employees.field.fullName': string;
  'employees.field.email': string;
  'employees.field.phone': string;
  'employees.field.jobTitle': string;
  'employees.field.hireDate': string;
  'employees.field.notes': string;
  'employees.field.department': string;
  'employees.field.noDepartment': string;
  'employees.createDialog.title': string;
  'employees.createDialog.description': string;
  'employees.editDialog.title': string;
  'employees.editDialog.description': string;
  'departments.title': string;
  'departments.description': string;
  'departments.table.name': string;
  'departments.table.description': string;
  'departments.table.employeeCount': string;
  'departments.table.actions': string;
  'departments.action.createDepartment': string;
  'departments.action.delete': string;
  'departments.createDialog.title': string;
  'departments.createDialog.description': string;
  'departments.field.name': string;
  'departments.field.description': string;
  'employees.empty.title': string;
  'employees.empty.description': string;
  'departments.empty.title': string;
  'departments.empty.description': string;
  'attendance.title': string;
  'attendance.description': string;
  'attendance.selectEmployee': string;
  'attendance.action.checkIn': string;
  'attendance.action.checkOut': string;
  'attendance.table.employee': string;
  'attendance.table.checkIn': string;
  'attendance.table.checkOut': string;
  'attendance.table.status': string;
  'attendance.status.present': string;
  'attendance.status.incomplete': string;
  'attendance.empty.title': string;
  'attendance.empty.description': string;
  'leaves.title': string;
  'leaves.description': string;
  'leaves.tab.requests': string;
  'leaves.tab.types': string;
  'leaves.table.employee': string;
  'leaves.table.type': string;
  'leaves.table.startDate': string;
  'leaves.table.endDate': string;
  'leaves.table.status': string;
  'leaves.table.actions': string;
  'leaves.status.pending': string;
  'leaves.status.approved': string;
  'leaves.status.rejected': string;
  'leaves.action.request': string;
  'leaves.action.approve': string;
  'leaves.action.reject': string;
  'leaves.action.createType': string;
  'leaves.requestDialog.title': string;
  'leaves.requestDialog.description': string;
  'leaves.field.employee': string;
  'leaves.field.leaveType': string;
  'leaves.field.startDate': string;
  'leaves.field.endDate': string;
  'leaves.field.reason': string;
  'leaves.typeDialog.title': string;
  'leaves.field.typeName': string;
  'leaves.empty.title': string;
  'leaves.empty.description': string;
  'holidays.title': string;
  'holidays.description': string;
  'holidays.action.create': string;
  'holidays.table.name': string;
  'holidays.table.date': string;
  'holidays.table.description': string;
  'holidays.table.actions': string;
  'holidays.dialog.title': string;
  'holidays.field.name': string;
  'holidays.field.date': string;
  'holidays.empty.title': string;
  'holidays.empty.description': string;
  'reports.title': string;
  'reports.description': string;
  'reports.card.totalEmployees': string;
  'reports.card.activeEmployees': string;
  'reports.card.presentToday': string;
  'reports.card.onLeaveToday': string;
  'reports.byDepartment': string;
  'reports.upcomingHolidays': string;
  'reports.noUpcomingHolidays': string;
  'settings.title': string;
  'settings.description': string;
  'settings.field.companyName': string;
  'settings.field.workStart': string;
  'settings.field.workEnd': string;
  'settings.saved': string;
  'backup.title': string;
  'backup.description': string;
  'backup.action.create': string;
  'backup.table.file': string;
  'backup.table.size': string;
  'backup.table.createdAt': string;
  'backup.empty.title': string;
  'backup.empty.description': string;
};

const en: TranslationKeys = {
  'app.name': 'AttendanceApp',
  'app.tagline': 'Local Attendance Management',
  'nav.dashboard': 'Dashboard',
  'nav.employees': 'Employees',
  'nav.attendance': 'Attendance',
  'nav.users': 'Users',
  'nav.leaves': 'Leaves',
  'nav.holidays': 'Holidays',
  'nav.reports': 'Reports',
  'nav.settings': 'Settings',
  'nav.backup': 'Backup',
  'page.dashboard.title': 'Dashboard',
  'page.dashboard.description': 'Overview of your attendance management system.',
  'page.comingSoon': 'Coming Soon',
  'page.comingSoonDescription': 'This feature will be available in a future phase.',
  'status.connected': 'Database Connected',
  'status.disconnected': 'Database Disconnected',
  'status.checking': 'Checking connection...',
  'topbar.toggleTheme': 'Toggle theme',
  'topbar.toggleLanguage': 'Toggle language',
  'empty.title': 'No data yet',
  'empty.description': 'Content will appear here once this feature is implemented.',
  'error.title': 'Something went wrong',
  'error.description': 'An error occurred while loading this page.',
  'error.retry': 'Try again',
  'common.cancel': 'Cancel',
  'common.save': 'Save',
  'common.create': 'Create',
  'common.loading': 'Loading...',
  'auth.setup.title': 'Create Administrator Account',
  'auth.setup.description': 'Set up the first administrator account to get started.',
  'auth.login.title': 'Sign In',
  'auth.login.description': 'Enter your credentials to access the system.',
  'auth.field.username': 'Username',
  'auth.field.email': 'Email (optional)',
  'auth.field.fullName': 'Full Name',
  'auth.field.password': 'Password',
  'auth.field.role': 'Role',
  'auth.action.createAccount': 'Create Account',
  'auth.action.signIn': 'Sign In',
  'auth.action.signOut': 'Sign Out',
  'auth.loggedInAs': 'Signed in as',
  'users.title': 'Users',
  'users.description': 'Manage user accounts and access.',
  'users.tab.users': 'Users',
  'users.tab.roles': 'Roles & Permissions',
  'users.table.username': 'Username',
  'users.table.fullName': 'Full Name',
  'users.table.email': 'Email',
  'users.table.role': 'Role',
  'users.table.status': 'Status',
  'users.table.lastLogin': 'Last Login',
  'users.table.actions': 'Actions',
  'users.status.active': 'Active',
  'users.status.inactive': 'Inactive',
  'users.action.createUser': 'Create User',
  'users.action.edit': 'Edit',
  'users.action.deactivate': 'Deactivate',
  'users.action.activate': 'Activate',
  'users.createDialog.title': 'Create User',
  'users.createDialog.description': 'Add a new user account and assign a role.',
  'users.editDialog.title': 'Edit User',
  'users.editDialog.description': 'Update this user account and its role.',
  'users.editDialog.passwordHint': 'Leave blank to keep the current password.',
  'users.field.newPassword': 'New Password',
  'users.neverLoggedIn': 'Never',
  'roles.title': 'Roles',
  'roles.description': 'Define custom roles and configure their permissions.',
  'roles.action.createRole': 'Create Role',
  'roles.createDialog.title': 'Create Role',
  'roles.createDialog.description': 'Define a new role and select its permissions.',
  'roles.field.name': 'Role Name',
  'roles.field.description': 'Description (optional)',
  'roles.field.permissions': 'Permissions',
  'roles.systemBadge': 'System',
  'employees.title': 'Employees',
  'employees.description': 'Manage employee records and departments.',
  'employees.tab.employees': 'Employees',
  'employees.tab.departments': 'Departments',
  'employees.table.code': 'Code',
  'employees.table.fullName': 'Full Name',
  'employees.table.email': 'Email',
  'employees.table.phone': 'Phone',
  'employees.table.jobTitle': 'Job Title',
  'employees.table.department': 'Department',
  'employees.table.hireDate': 'Hire Date',
  'employees.table.status': 'Status',
  'employees.table.actions': 'Actions',
  'employees.status.active': 'Active',
  'employees.status.inactive': 'Inactive',
  'employees.action.createEmployee': 'Create Employee',
  'employees.action.edit': 'Edit',
  'employees.action.deactivate': 'Deactivate',
  'employees.action.activate': 'Activate',
  'employees.field.fullName': 'Full Name',
  'employees.field.email': 'Email (optional)',
  'employees.field.phone': 'Phone (optional)',
  'employees.field.jobTitle': 'Job Title (optional)',
  'employees.field.hireDate': 'Hire Date',
  'employees.field.notes': 'Notes (optional)',
  'employees.field.department': 'Department',
  'employees.field.noDepartment': 'No department',
  'employees.createDialog.title': 'Create Employee',
  'employees.createDialog.description': 'Add a new employee record.',
  'employees.editDialog.title': 'Edit Employee',
  'employees.editDialog.description': 'Update this employee record.',
  'departments.title': 'Departments',
  'departments.description': 'Organize employees into departments.',
  'departments.table.name': 'Name',
  'departments.table.description': 'Description',
  'departments.table.employeeCount': 'Employees',
  'departments.table.actions': 'Actions',
  'departments.action.createDepartment': 'Create Department',
  'departments.action.delete': 'Delete',
  'departments.createDialog.title': 'Create Department',
  'departments.createDialog.description': 'Add a new department.',
  'departments.field.name': 'Department Name',
  'departments.field.description': 'Description (optional)',
  'employees.empty.title': 'No employees yet',
  'employees.empty.description': 'Create your first employee record to get started.',
  'departments.empty.title': 'No departments yet',
  'departments.empty.description': 'Create a department to start organizing employees.',
  'attendance.title': 'Attendance',
  'attendance.description': 'Track daily employee check-ins and check-outs.',
  'attendance.selectEmployee': 'Select an employee',
  'attendance.action.checkIn': 'Check In',
  'attendance.action.checkOut': 'Check Out',
  'attendance.table.employee': 'Employee',
  'attendance.table.checkIn': 'Check In',
  'attendance.table.checkOut': 'Check Out',
  'attendance.table.status': 'Status',
  'attendance.status.present': 'Present',
  'attendance.status.incomplete': 'Checked In',
  'attendance.empty.title': 'No check-ins today',
  'attendance.empty.description': 'Attendance records for today will appear here.',
  'leaves.title': 'Leaves',
  'leaves.description': 'Manage leave requests and leave types.',
  'leaves.tab.requests': 'Requests',
  'leaves.tab.types': 'Leave Types',
  'leaves.table.employee': 'Employee',
  'leaves.table.type': 'Type',
  'leaves.table.startDate': 'Start Date',
  'leaves.table.endDate': 'End Date',
  'leaves.table.status': 'Status',
  'leaves.table.actions': 'Actions',
  'leaves.status.pending': 'Pending',
  'leaves.status.approved': 'Approved',
  'leaves.status.rejected': 'Rejected',
  'leaves.action.request': 'Request Leave',
  'leaves.action.approve': 'Approve',
  'leaves.action.reject': 'Reject',
  'leaves.action.createType': 'Create Leave Type',
  'leaves.requestDialog.title': 'Request Leave',
  'leaves.requestDialog.description': 'Submit a new leave request for an employee.',
  'leaves.field.employee': 'Employee',
  'leaves.field.leaveType': 'Leave Type',
  'leaves.field.startDate': 'Start Date',
  'leaves.field.endDate': 'End Date',
  'leaves.field.reason': 'Reason (optional)',
  'leaves.typeDialog.title': 'Create Leave Type',
  'leaves.field.typeName': 'Type Name',
  'leaves.empty.title': 'No leave requests yet',
  'leaves.empty.description': 'Submit a leave request to get started.',
  'holidays.title': 'Holidays',
  'holidays.description': 'Manage the company holiday calendar.',
  'holidays.action.create': 'Add Holiday',
  'holidays.table.name': 'Name',
  'holidays.table.date': 'Date',
  'holidays.table.description': 'Description',
  'holidays.table.actions': 'Actions',
  'holidays.dialog.title': 'Add Holiday',
  'holidays.field.name': 'Holiday Name',
  'holidays.field.date': 'Date',
  'holidays.empty.title': 'No holidays yet',
  'holidays.empty.description': 'Add a holiday to build the calendar.',
  'reports.title': 'Reports',
  'reports.description': 'Overview of employees, attendance, and leave.',
  'reports.card.totalEmployees': 'Total Employees',
  'reports.card.activeEmployees': 'Active Employees',
  'reports.card.presentToday': 'Present Today',
  'reports.card.onLeaveToday': 'On Leave Today',
  'reports.byDepartment': 'Employees by Department',
  'reports.upcomingHolidays': 'Upcoming Holidays',
  'reports.noUpcomingHolidays': 'No upcoming holidays',
  'settings.title': 'Settings',
  'settings.description': 'Configure general application settings.',
  'settings.field.companyName': 'Company Name',
  'settings.field.workStart': 'Default Work Start Time',
  'settings.field.workEnd': 'Default Work End Time',
  'settings.saved': 'Settings saved',
  'backup.title': 'Backup',
  'backup.description': 'Create and manage local database backups.',
  'backup.action.create': 'Create Backup',
  'backup.table.file': 'File',
  'backup.table.size': 'Size',
  'backup.table.createdAt': 'Created',
  'backup.empty.title': 'No backups yet',
  'backup.empty.description': 'Create your first backup to protect your data.',
};

const ar: TranslationKeys = {
  'app.name': 'نظام الحضور',
  'app.tagline': 'إدارة الحضور المحلية',
  'nav.dashboard': 'لوحة التحكم',
  'nav.employees': 'الموظفون',
  'nav.attendance': 'الحضور',
  'nav.users': 'المستخدمون',
  'nav.leaves': 'الإجازات',
  'nav.holidays': 'العطل',
  'nav.reports': 'التقارير',
  'nav.settings': 'الإعدادات',
  'nav.backup': 'النسخ الاحتياطي',
  'page.dashboard.title': 'لوحة التحكم',
  'page.dashboard.description': 'نظرة عامة على نظام إدارة الحضور.',
  'page.comingSoon': 'قريباً',
  'page.comingSoonDescription': 'ستتوفر هذه الميزة في مرحلة لاحقة.',
  'status.connected': 'قاعدة البيانات متصلة',
  'status.disconnected': 'قاعدة البيانات غير متصلة',
  'status.checking': 'جاري التحقق من الاتصال...',
  'topbar.toggleTheme': 'تبديل المظهر',
  'topbar.toggleLanguage': 'تبديل اللغة',
  'empty.title': 'لا توجد بيانات',
  'empty.description': 'سيظهر المحتوى هنا بمجرد تنفيذ هذه الميزة.',
  'error.title': 'حدث خطأ',
  'error.description': 'حدث خطأ أثناء تحميل هذه الصفحة.',
  'error.retry': 'حاول مرة أخرى',
  'common.cancel': 'إلغاء',
  'common.save': 'حفظ',
  'common.create': 'إنشاء',
  'common.loading': 'جارٍ التحميل...',
  'auth.setup.title': 'إنشاء حساب المسؤول',
  'auth.setup.description': 'قم بإعداد أول حساب مسؤول للبدء في استخدام النظام.',
  'auth.login.title': 'تسجيل الدخول',
  'auth.login.description': 'أدخل بيانات الاعتماد للوصول إلى النظام.',
  'auth.field.username': 'اسم المستخدم',
  'auth.field.email': 'البريد الإلكتروني (اختياري)',
  'auth.field.fullName': 'الاسم الكامل',
  'auth.field.password': 'كلمة المرور',
  'auth.field.role': 'الدور',
  'auth.action.createAccount': 'إنشاء الحساب',
  'auth.action.signIn': 'تسجيل الدخول',
  'auth.action.signOut': 'تسجيل الخروج',
  'auth.loggedInAs': 'تم تسجيل الدخول باسم',
  'users.title': 'المستخدمون',
  'users.description': 'إدارة حسابات المستخدمين وصلاحيات الوصول.',
  'users.tab.users': 'المستخدمون',
  'users.tab.roles': 'الأدوار والصلاحيات',
  'users.table.username': 'اسم المستخدم',
  'users.table.fullName': 'الاسم الكامل',
  'users.table.email': 'البريد الإلكتروني',
  'users.table.role': 'الدور',
  'users.table.status': 'الحالة',
  'users.table.lastLogin': 'آخر تسجيل دخول',
  'users.table.actions': 'إجراءات',
  'users.status.active': 'نشط',
  'users.status.inactive': 'غير نشط',
  'users.action.createUser': 'إنشاء مستخدم',
  'users.action.edit': 'تعديل',
  'users.action.deactivate': 'تعطيل',
  'users.action.activate': 'تفعيل',
  'users.createDialog.title': 'إنشاء مستخدم',
  'users.createDialog.description': 'إضافة حساب مستخدم جديد وتعيين دور له.',
  'users.editDialog.title': 'تعديل المستخدم',
  'users.editDialog.description': 'تحديث بيانات هذا المستخدم ودوره.',
  'users.editDialog.passwordHint': 'اتركه فارغاً للاحتفاظ بكلمة المرور الحالية.',
  'users.field.newPassword': 'كلمة مرور جديدة',
  'users.neverLoggedIn': 'أبداً',
  'roles.title': 'الأدوار',
  'roles.description': 'تحديد أدوار مخصصة وضبط صلاحياتها.',
  'roles.action.createRole': 'إنشاء دور',
  'roles.createDialog.title': 'إنشاء دور',
  'roles.createDialog.description': 'تحديد دور جديد واختيار صلاحياته.',
  'roles.field.name': 'اسم الدور',
  'roles.field.description': 'الوصف (اختياري)',
  'roles.field.permissions': 'الصلاحيات',
  'roles.systemBadge': 'نظام',
  'employees.title': 'الموظفون',
  'employees.description': 'إدارة سجلات الموظفين والأقسام.',
  'employees.tab.employees': 'الموظفون',
  'employees.tab.departments': 'الأقسام',
  'employees.table.code': 'الرقم الوظيفي',
  'employees.table.fullName': 'الاسم الكامل',
  'employees.table.email': 'البريد الإلكتروني',
  'employees.table.phone': 'الهاتف',
  'employees.table.jobTitle': 'المسمى الوظيفي',
  'employees.table.department': 'القسم',
  'employees.table.hireDate': 'تاريخ التعيين',
  'employees.table.status': 'الحالة',
  'employees.table.actions': 'إجراءات',
  'employees.status.active': 'نشط',
  'employees.status.inactive': 'غير نشط',
  'employees.action.createEmployee': 'إضافة موظف',
  'employees.action.edit': 'تعديل',
  'employees.action.deactivate': 'تعطيل',
  'employees.action.activate': 'تفعيل',
  'employees.field.fullName': 'الاسم الكامل',
  'employees.field.email': 'البريد الإلكتروني (اختياري)',
  'employees.field.phone': 'الهاتف (اختياري)',
  'employees.field.jobTitle': 'المسمى الوظيفي (اختياري)',
  'employees.field.hireDate': 'تاريخ التعيين',
  'employees.field.notes': 'ملاحظات (اختياري)',
  'employees.field.department': 'القسم',
  'employees.field.noDepartment': 'بدون قسم',
  'employees.createDialog.title': 'إضافة موظف',
  'employees.createDialog.description': 'إضافة سجل موظف جديد.',
  'employees.editDialog.title': 'تعديل بيانات الموظف',
  'employees.editDialog.description': 'تحديث سجل هذا الموظف.',
  'departments.title': 'الأقسام',
  'departments.description': 'تنظيم الموظفين ضمن أقسام.',
  'departments.table.name': 'الاسم',
  'departments.table.description': 'الوصف',
  'departments.table.employeeCount': 'عدد الموظفين',
  'departments.table.actions': 'إجراءات',
  'departments.action.createDepartment': 'إضافة قسم',
  'departments.action.delete': 'حذف',
  'departments.createDialog.title': 'إضافة قسم',
  'departments.createDialog.description': 'إضافة قسم جديد.',
  'departments.field.name': 'اسم القسم',
  'departments.field.description': 'الوصف (اختياري)',
  'employees.empty.title': 'لا يوجد موظفون بعد',
  'employees.empty.description': 'أضف سجل الموظف الأول للبدء.',
  'departments.empty.title': 'لا توجد أقسام بعد',
  'departments.empty.description': 'أضف قسماً للبدء بتنظيم الموظفين.',
  'attendance.title': 'الحضور',
  'attendance.description': 'تتبع تسجيل حضور وانصراف الموظفين يومياً.',
  'attendance.selectEmployee': 'اختر موظفاً',
  'attendance.action.checkIn': 'تسجيل حضور',
  'attendance.action.checkOut': 'تسجيل انصراف',
  'attendance.table.employee': 'الموظف',
  'attendance.table.checkIn': 'وقت الحضور',
  'attendance.table.checkOut': 'وقت الانصراف',
  'attendance.table.status': 'الحالة',
  'attendance.status.present': 'حاضر',
  'attendance.status.incomplete': 'حاضر (لم ينصرف)',
  'attendance.empty.title': 'لا يوجد تسجيل حضور اليوم',
  'attendance.empty.description': 'ستظهر سجلات حضور اليوم هنا.',
  'leaves.title': 'الإجازات',
  'leaves.description': 'إدارة طلبات الإجازات وأنواعها.',
  'leaves.tab.requests': 'الطلبات',
  'leaves.tab.types': 'أنواع الإجازات',
  'leaves.table.employee': 'الموظف',
  'leaves.table.type': 'النوع',
  'leaves.table.startDate': 'تاريخ البداية',
  'leaves.table.endDate': 'تاريخ النهاية',
  'leaves.table.status': 'الحالة',
  'leaves.table.actions': 'إجراءات',
  'leaves.status.pending': 'قيد الانتظار',
  'leaves.status.approved': 'موافق عليها',
  'leaves.status.rejected': 'مرفوضة',
  'leaves.action.request': 'طلب إجازة',
  'leaves.action.approve': 'موافقة',
  'leaves.action.reject': 'رفض',
  'leaves.action.createType': 'إضافة نوع إجازة',
  'leaves.requestDialog.title': 'طلب إجازة',
  'leaves.requestDialog.description': 'إرسال طلب إجازة جديد لموظف.',
  'leaves.field.employee': 'الموظف',
  'leaves.field.leaveType': 'نوع الإجازة',
  'leaves.field.startDate': 'تاريخ البداية',
  'leaves.field.endDate': 'تاريخ النهاية',
  'leaves.field.reason': 'السبب (اختياري)',
  'leaves.typeDialog.title': 'إضافة نوع إجازة',
  'leaves.field.typeName': 'اسم النوع',
  'leaves.empty.title': 'لا توجد طلبات إجازة بعد',
  'leaves.empty.description': 'أرسل طلب إجازة للبدء.',
  'holidays.title': 'العطل',
  'holidays.description': 'إدارة تقويم العطل الرسمية للشركة.',
  'holidays.action.create': 'إضافة عطلة',
  'holidays.table.name': 'الاسم',
  'holidays.table.date': 'التاريخ',
  'holidays.table.description': 'الوصف',
  'holidays.table.actions': 'إجراءات',
  'holidays.dialog.title': 'إضافة عطلة',
  'holidays.field.name': 'اسم العطلة',
  'holidays.field.date': 'التاريخ',
  'holidays.empty.title': 'لا توجد عطل بعد',
  'holidays.empty.description': 'أضف عطلة لبناء التقويم.',
  'reports.title': 'التقارير',
  'reports.description': 'نظرة عامة على الموظفين والحضور والإجازات.',
  'reports.card.totalEmployees': 'إجمالي الموظفين',
  'reports.card.activeEmployees': 'الموظفون النشطون',
  'reports.card.presentToday': 'الحاضرون اليوم',
  'reports.card.onLeaveToday': 'في إجازة اليوم',
  'reports.byDepartment': 'الموظفون حسب القسم',
  'reports.upcomingHolidays': 'العطل القادمة',
  'reports.noUpcomingHolidays': 'لا توجد عطل قادمة',
  'settings.title': 'الإعدادات',
  'settings.description': 'ضبط إعدادات التطبيق العامة.',
  'settings.field.companyName': 'اسم الشركة',
  'settings.field.workStart': 'وقت بدء الدوام الافتراضي',
  'settings.field.workEnd': 'وقت انتهاء الدوام الافتراضي',
  'settings.saved': 'تم حفظ الإعدادات',
  'backup.title': 'النسخ الاحتياطي',
  'backup.description': 'إنشاء وإدارة النسخ الاحتياطية المحلية لقاعدة البيانات.',
  'backup.action.create': 'إنشاء نسخة احتياطية',
  'backup.table.file': 'الملف',
  'backup.table.size': 'الحجم',
  'backup.table.createdAt': 'تاريخ الإنشاء',
  'backup.empty.title': 'لا توجد نسخ احتياطية بعد',
  'backup.empty.description': 'أنشئ أول نسخة احتياطية لحماية بياناتك.',
};

const translations: Record<Locale, TranslationKeys> = { en, ar };

export function t(locale: Locale, key: keyof TranslationKeys): string {
  return translations[locale][key];
}

export type { TranslationKeys };
