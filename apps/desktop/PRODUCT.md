# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
HR and administrative staff working at a desk (laptop/desktop browser) who record daily employee attendance, approve leave requests, maintain the employee and department directory, and manage user accounts and permissions. Occasional phone use. (Confirmed by the owner, 2026-11-15.)

## Product Purpose
A company attendance management system: daily check-in/check-out records per employee, leave requests with approval, public holidays, staff directory with departments, role-based user access, and summary reports. Success means an admin can see who is in today and act on pending items in seconds, and records stay correct.

## Operating Context
- Deployed as a web app on Vercel (NestJS API as a serverless function, MongoDB Atlas). A legacy Electron desktop shell still exists in the repo and shares the same renderer.
- First run bootstraps a single administrator; further users are created with roles carrying granular permissions (`employees.view`, `leaves.edit`, ...). Every screen must respect those permissions.
- Attendance is one record per employee per business day.

## Capabilities and Constraints
- Bilingual: English (default) and Arabic with full RTL; the choice is remembered per browser.
- Light and dark themes, following the system by default.
- No file system on the server: backups are data exports downloaded by the browser; Atlas handles database-level backups.
- Undecided: per-employee shifts/late tracking, payroll, self-service employee check-in.

## Brand Commitments
Product name in UI: "Attendance" (app.name in i18n). No logo asset exists beyond `resources/icon.svg`.

## Evidence on Hand
No customer testimonials, metrics, or proof assets. Do not fabricate any.

## Product Principles
1. Today first: the current day's attendance and pending approvals are the primary view.
2. Every record is trustworthy: destructive actions confirm, errors explain what to do next.
3. Permission-aware by default: users only see what they can act on.
4. Equal in both languages: Arabic RTL is a first-class layout, not a mirror afterthought.

## Accessibility & Inclusion
Target WCAG 2.1 AA contrast and full keyboard operation (inferred standard for an admin tool; not separately specified by the owner).
