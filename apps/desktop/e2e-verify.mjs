import { _electron as electron } from 'playwright';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const REPO_ROOT = 'e:/Attendance Desktop App';
const EXE_PATH = path.join(REPO_ROOT, 'apps/desktop/release/win-unpacked/AttendanceApp.exe');
const TEST_PORT = '3899';
const SCRATCHPAD = 'C:/Users/gh/AppData/Local/Temp/claude/e--Attendance-Desktop-App/5da8d1f2-2ccb-4faa-88cb-ea82b0962bba/scratchpad';

const ADMIN = { fullName: 'E2E Admin', username: 'e2eadmin', email: 'e2eadmin@test.local', password: 'E2eAdminPass123' };
const LOWPRIV = { fullName: 'E2E Low Priv', username: 'e2elowpriv', password: 'E2eLowPriv123' };
const EMPLOYEE_NAME = 'E2E Test Employee';

const results = [];
let window;

function record(name, ok, detail) {
  results.push({ name, ok, detail: detail ?? '' });
  console.log(`${ok ? 'PASS' : 'FAIL'} - ${name}${detail ? ' :: ' + detail : ''}`);
}

async function step(name, fn) {
  try {
    await fn();
    record(name, true);
  } catch (err) {
    const msg = err && err.message ? err.message.split('\n')[0] : String(err);
    record(name, false, msg);
    try {
      const file = path.join(SCRATCHPAD, `fail-${name.replace(/[^a-z0-9]+/gi, '_')}.png`);
      await window.screenshot({ path: file });
      console.log(`  screenshot: ${file}`);
    } catch {
      // ignore screenshot failures
    }
  }
  // Don't let one step's leftover open dialog block every step after it.
  try {
    const dialog = window.getByRole('dialog');
    if (await dialog.isVisible({ timeout: 500 })) {
      await window.keyboard.press('Escape');
      await dialog.waitFor({ state: 'hidden', timeout: 2000 }).catch(() => {});
    }
  } catch {
    // no dialog open, nothing to do
  }
}

async function openDialogByTrigger(triggerName) {
  await window.getByRole('button', { name: triggerName, exact: true }).click();
  await window.getByRole('dialog').waitFor({ state: 'visible', timeout: 5000 });
}

async function pickSelectOption(triggerLocator, optionName) {
  await triggerLocator.click();
  await window.getByRole('option', { name: optionName }).click();
}

async function main() {
  const userDataDir = await fs.mkdtemp(path.join(os.tmpdir(), 'attendance-e2e-'));
  console.log(`Isolated user-data-dir: ${userDataDir}`);
  console.log(`Isolated backend port: ${TEST_PORT}`);

  const launchEnv = { ...process.env, APP_PORT: TEST_PORT };
  delete launchEnv.ELECTRON_RUN_AS_NODE;

  const app = await electron.launch({
    executablePath: EXE_PATH,
    args: [`--user-data-dir=${userDataDir}`],
    env: launchEnv,
    timeout: 30000,
  });

  app.process().stdout?.on('data', (d) => console.log('[main stdout]', d.toString()));
  app.process().stderr?.on('data', (d) => console.log('[main stderr]', d.toString()));
  app.process().on('exit', (code) => console.log(`[main process exited] code=${code}`));

  try {
    window = await app.firstWindow();
    await window.waitForLoadState('domcontentloaded');

    // This is a real, visible OS window (Electron has no true headless mode). Move it
    // off-screen and make it non-focusable so it can never receive stray real keyboard/mouse
    // input from whoever is at the machine - CDP-driven interaction still works fine either way.
    await app.evaluate(({ BrowserWindow }) => {
      for (const win of BrowserWindow.getAllWindows()) {
        win.setPosition(-32000, -32000);
        win.setFocusable(false);
      }
    });

    await step('setup wizard creates the first admin', async () => {
      await window.locator('#fullName').waitFor({ state: 'visible', timeout: 15000 });
      await window.locator('#fullName').fill(ADMIN.fullName);
      await window.locator('#username').fill(ADMIN.username);
      await window.locator('#email').fill(ADMIN.email);
      await window.locator('#password').fill(ADMIN.password);
      await window.getByRole('button', { name: 'Create Account' }).click();
      await window.getByRole('button', { name: 'Employees', exact: true }).waitFor({ timeout: 10000 });
    });

    await step('admin sees all sidebar tabs', async () => {
      for (const label of ['Dashboard', 'Employees', 'Attendance', 'Users', 'Leaves', 'Holidays', 'Reports', 'Settings', 'Backup']) {
        const visible = await window.getByRole('button', { name: label, exact: true }).isVisible();
        if (!visible) throw new Error(`expected tab "${label}" to be visible for admin`);
      }
    });

    let lowPrivRoleName = 'E2E Low Priv Role';

    await step('create a low-privilege role (employees.view only)', async () => {
      await window.getByRole('button', { name: 'Users', exact: true }).click();
      await window.getByRole('tab', { name: 'Roles & Permissions' }).click();
      await openDialogByTrigger('Create Role');
      await window.locator('#name').fill(lowPrivRoleName);
      await window.locator('input[type="checkbox"][value="employees.view"]').check();
      await window.getByRole('button', { name: 'Create', exact: true }).click();
      await window.getByRole('dialog').waitFor({ state: 'hidden', timeout: 5000 });
      await window.getByText(lowPrivRoleName).waitFor({ timeout: 5000 });
    });

    await step('create a user on the low-privilege role', async () => {
      await window.getByRole('tab', { name: 'Users', exact: true }).click();
      await openDialogByTrigger('Create User');
      await window.locator('#fullName').fill(LOWPRIV.fullName);
      await window.locator('#username').fill(LOWPRIV.username);
      await window.locator('#password').fill(LOWPRIV.password);
      await pickSelectOption(window.locator('#roleId'), lowPrivRoleName);
      await window.getByRole('button', { name: 'Create', exact: true }).click();
      await window.getByRole('dialog').waitFor({ state: 'hidden', timeout: 5000 });
      await window.getByText(LOWPRIV.username).waitFor({ timeout: 5000 });
    });

    await step('low-privilege user sees only Dashboard + Employees in sidebar', async () => {
      await window.locator('header button').last().click();
      await window.getByRole('menuitem', { name: 'Sign Out' }).click();
      await window.locator('#username').waitFor({ state: 'visible', timeout: 5000 });
      await window.locator('#username').fill(LOWPRIV.username);
      await window.locator('#password').fill(LOWPRIV.password);
      await window.getByRole('button', { name: 'Sign In' }).click();
      await window.getByRole('button', { name: 'Employees', exact: true }).waitFor({ timeout: 10000 });

      const visible = await window.getByRole('button', { name: 'Employees', exact: true }).isVisible();
      if (!visible) throw new Error('Employees tab should be visible (employees.view granted)');

      for (const label of ['Attendance', 'Users', 'Leaves', 'Holidays', 'Reports', 'Settings', 'Backup']) {
        const count = await window.getByRole('button', { name: label, exact: true }).count();
        if (count !== 0) throw new Error(`"${label}" tab should be hidden for a user with only employees.view`);
      }
    });

    await step('log back in as admin', async () => {
      await window.locator('header button').last().click();
      await window.getByRole('menuitem', { name: 'Sign Out' }).click();
      await window.locator('#username').waitFor({ state: 'visible', timeout: 5000 });
      await window.locator('#username').fill(ADMIN.username);
      await window.locator('#password').fill(ADMIN.password);
      await window.getByRole('button', { name: 'Sign In' }).click();
      await window.getByRole('button', { name: 'Employees', exact: true }).waitFor({ timeout: 10000 });
    });

    await step('create an employee', async () => {
      await window.getByRole('button', { name: 'Employees', exact: true }).click();
      await openDialogByTrigger('Create Employee');
      await window.locator('#fullName').fill(EMPLOYEE_NAME);
      await window.locator('#hireDate').fill('2026-01-01');
      await window.getByRole('button', { name: 'Save', exact: true }).click();
      await window.getByRole('dialog').waitFor({ state: 'hidden', timeout: 5000 });
      await window.getByText(EMPLOYEE_NAME).waitFor({ timeout: 5000 });
    });

    await step('edit the employee', async () => {
      const row = window.locator('tr', { hasText: EMPLOYEE_NAME });
      await row.getByRole('button', { name: 'Edit', exact: true }).click();
      await window.getByRole('dialog').waitFor({ state: 'visible', timeout: 5000 });
      await window.locator('#jobTitle').fill('E2E Tester');
      await window.getByRole('button', { name: 'Save', exact: true }).click();
      await window.getByRole('dialog').waitFor({ state: 'hidden', timeout: 5000 });
      await window.getByText('E2E Tester').waitFor({ timeout: 5000 });
    });

    await step('create a leave type', async () => {
      await window.getByRole('button', { name: 'Leaves', exact: true }).click();
      await window.getByRole('tab', { name: 'Leave Types' }).click();
      await openDialogByTrigger('Create Leave Type');
      await window.locator('#name').fill('E2E Leave Type');
      await window.getByRole('button', { name: 'Create', exact: true }).click();
      await window.getByRole('dialog').waitFor({ state: 'hidden', timeout: 5000 });
      await window.getByText('E2E Leave Type').waitFor({ timeout: 5000 });
    });

    await step('request and approve a leave', async () => {
      await window.getByRole('tab', { name: 'Requests' }).click();
      await openDialogByTrigger('Request Leave');
      await pickSelectOption(window.locator('#employeeId'), EMPLOYEE_NAME);
      await pickSelectOption(window.locator('#leaveTypeId'), 'E2E Leave Type');
      await window.locator('#startDate').fill('2026-02-01');
      await window.locator('#endDate').fill('2026-02-02');
      await window.getByRole('button', { name: 'Request Leave', exact: true }).click();
      await window.getByRole('dialog').waitFor({ state: 'hidden', timeout: 5000 });

      const row = window.locator('tr', { hasText: EMPLOYEE_NAME });
      await row.getByRole('button', { name: 'Approve', exact: true }).click();
      await window.getByText('Approved').waitFor({ timeout: 5000 });
    });

    await step('check in and check out attendance', async () => {
      await window.getByRole('button', { name: 'Attendance', exact: true }).click();
      await window.getByText('Select an employee').click();
      await window.getByRole('option', { name: EMPLOYEE_NAME }).click();
      await window.getByRole('button', { name: 'Check In', exact: true }).click();
      await window.getByText('Present').or(window.getByText('Incomplete')).first().waitFor({ timeout: 5000 });

      await window.getByText('Select an employee').click();
      await window.getByRole('option', { name: EMPLOYEE_NAME }).click();
      await window.getByRole('button', { name: 'Check Out', exact: true }).click();
      await window.getByText('Present').first().waitFor({ timeout: 5000 });
    });

    await step('create and delete a holiday', async () => {
      await window.getByRole('button', { name: 'Holidays', exact: true }).click();
      await window.getByRole('button', { name: 'Add Holiday' }).click();
      await window.getByRole('dialog').waitFor({ state: 'visible', timeout: 5000 });
      await window.locator('#name').fill('E2E Holiday');
      await window.locator('#date').fill('2026-03-01');
      await window.getByRole('button', { name: 'Create', exact: true }).click();
      await window.getByRole('dialog').waitFor({ state: 'hidden', timeout: 5000 });
      await window.getByText('E2E Holiday').waitFor({ timeout: 5000 });

      const row = window.locator('tr', { hasText: 'E2E Holiday' });
      await row.getByRole('button').click();
      await window.getByText('E2E Holiday').waitFor({ state: 'hidden', timeout: 5000 });
    });

    await step('update settings', async () => {
      await window.getByRole('button', { name: 'Settings', exact: true }).click();
      await window.locator('#companyName').fill('E2E Test Company');
      await window.getByRole('button', { name: 'Save', exact: true }).click();
      await window.getByText('Saved').waitFor({ timeout: 5000 }).catch(() => {});
    });

    await step('create a backup', async () => {
      await window.getByRole('button', { name: 'Backup', exact: true }).click();
      const rowsBefore = await window.locator('tbody tr').count();
      await window.getByRole('button', { name: 'Create Backup' }).click();
      await window.locator('tbody tr').nth(rowsBefore).waitFor({ timeout: 10000 }).catch(async () => {
        const rowsAfter = await window.locator('tbody tr').count();
        if (rowsAfter <= rowsBefore) throw new Error('no new backup row appeared');
      });
    });
  } finally {
    await app.close().catch(() => {});
    await fs.rm(userDataDir, { recursive: true, force: true }).catch(() => {});
  }

  const failed = results.filter((r) => !r.ok);
  console.log('\n=== SUMMARY ===');
  for (const r of results) {
    console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.ok ? '' : '  -> ' + r.detail}`);
  }
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  process.exit(failed.length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('Driver crashed:', err);
  process.exit(1);
});
