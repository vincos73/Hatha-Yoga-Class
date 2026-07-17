// Plain committed constant instead of a git-derived value: some deploy
// environments (e.g. AI Studio's build pipeline) don't have git history
// available at build time, so a shell-computed number silently falls back.
// Bump this by one whenever a change is pushed to main.
export const BUILD_NUMBER = 26;
