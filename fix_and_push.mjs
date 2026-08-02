import { execSync, spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const workTree = String.raw`c:\Users\razin\OneDrive\Desktop\luxury jeweleris`;
const tmpGit = String.raw`C:\temp\lj-fresh2`;
const remoteUrl = 'https://github.com/luxuryjeweleris-byte/luxury-jeweleris.git';

// Clean temp
try { fs.rmSync(tmpGit, { recursive: true, force: true }); } catch {}
fs.mkdirSync(tmpGit, { recursive: true });

// Init bare repo outside OneDrive
execSync(`git init --bare "${tmpGit}"`, { stdio: 'inherit' });

// Fetch latest from GitHub
console.log('Fetching remote history from GitHub...');
execSync(`git --git-dir="${tmpGit}" fetch "${remoteUrl}" main:main`, { stdio: 'inherit' });
console.log('Fetched!');

// Stage everything from work tree
const env = { ...process.env, GIT_DIR: tmpGit, GIT_WORK_TREE: workTree };

// Exclude .git and node_modules from staging
execSync('git add -A', { cwd: workTree, env, stdio: 'inherit' });
console.log('Staged!');

// Commit
execSync(
  `git -c user.name="razin1325" -c user.email="148884456+razin1325@users.noreply.github.com" commit -m "section modified" --allow-empty`,
  { cwd: workTree, env, stdio: 'inherit' }
);
console.log('Committed!');

// Push to GitHub
console.log('Pushing to GitHub...');
execSync(`git --git-dir="${tmpGit}" push "${remoteUrl}" main:main`, { stdio: 'inherit' });
console.log('PUSH SUCCESSFUL!');

// === PERMANENT FIX: Replace broken .git with a fresh clone ===
console.log('\n=== Now fixing local .git permanently ===');

// Delete broken .git
console.log('Removing broken .git folder...');
try {
  execSync(`cmd /c "rmdir /s /q \\"${workTree}\\.git\\""`, { stdio: 'inherit' });
} catch (e) {
  // Try PowerShell as fallback
  execSync(`powershell -Command "Remove-Item -Path '${workTree}\\.git' -Recurse -Force"`, { stdio: 'inherit' });
}
console.log('Old .git removed!');

// Re-init fresh git repo in work tree
execSync(`git -C "${workTree}" init`, { stdio: 'inherit' });
execSync(`git -C "${workTree}" remote add origin "${remoteUrl}"`, { stdio: 'inherit' });

// Fetch and reset to remote state
execSync(`git -C "${workTree}" fetch origin main`, { stdio: 'inherit' });
execSync(`git -C "${workTree}" branch -M main`, { stdio: 'inherit' });
execSync(`git -C "${workTree}" reset --mixed origin/main`, { stdio: 'inherit' });

// Disable maintenance/geometric repack to avoid mmap
execSync(`git -C "${workTree}" config maintenance.gc.enabled false`, { stdio: 'inherit' });
execSync(`git -C "${workTree}" config core.preloadindex false`, { stdio: 'inherit' });
execSync(`git -C "${workTree}" config gc.auto 0`, { stdio: 'inherit' });

console.log('\n✅ ALL DONE! Local .git is now fresh and clean.');
console.log('Future pushes should work with: git add . && git commit -m "..." && git push');

// Cleanup temp
try { fs.rmSync(tmpGit, { recursive: true, force: true }); } catch {}
