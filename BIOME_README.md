# Biome Code Quality Standards

This document outlines the Biome configuration and code quality standards for the CHAT-005 development environment.

## Overview

Biome is a fast, modern formatter and linter for JavaScript, TypeScript, and web development. It replaces ESLint and Prettier with a single, high-performance tool.

## Configuration

The Biome configuration is located at the project root in `biome.json` and includes:

### Key Settings

- **Line Width**: 100 characters
- **Indentation**: 2 spaces (no tabs)
- **Quotes**: Double quotes for both JavaScript and JSX
- **Semicolons**: As needed (omitted where not required)
- **Trailing Commas**: ES5 compatible
- **Line Ending**: LF (Unix style)

### Linting Rules

#### Enabled Rule Categories
- **Recommended**: All Biome recommended rules
- **Accessibility**: a11y rules for React and HTML
- **Complexity**: Code complexity and maintainability
- **Correctness**: Potential runtime errors and bugs
- **Performance**: Performance optimization opportunities
- **Security**: Security vulnerabilities
- **Style**: Code style and conventions
- **Suspicious**: Potentially problematic code patterns
- **Nursery**: Experimental rules for future adoption

#### Key Rule Customizations

- **TypeScript**: Strict type checking enabled
- **React**: React Hooks and component patterns enforced
- **Imports**: Automatic import organization and deduplication
- **Unused Variables**: All unused variables flagged
- **Async/Await**: Proper async function usage enforced
- **Error Handling**: Result patterns for error handling encouraged

## Scripts

### Project Level Scripts

```bash
# Check for formatting and linting issues
npm run check

# Fix all auto-fixable issues
npm run check:fix

# Run linter only
npm run lint

# Fix linting issues
npm run lint:fix

# Check formatting only
npm run format

# Apply formatting fixes
npm run format:write
```

### App Level Scripts

Both `apps/chat-app` and `apps/chat-api` include the same scripts scoped to their source directories:

```bash
# In app directory
npm run check          # Check app source files
npm run check:fix       # Fix app issues
npm run lint           # Lint app source
npm run lint:fix       # Fix linting issues
npm run format         # Check formatting
npm run format:write   # Apply formatting
```

## Integration with Development Workflow

### Before Committing

1. Run `npm run check:fix` to auto-fix all issues
2. Manually review and fix remaining issues
3. Ensure all tests pass
4. Commit changes

### IDE Integration

Configure your IDE to run Biome on save:

- **VS Code**: Install Biome extension and enable format on save
- **WebStorm**: Configure Biome as external formatter and linter
- **Vim/Neovim**: Use Biome LSP or integrate with null-ls

### CI/CD Integration

Add Biome checks to your CI pipeline:

```yaml
# Example GitHub Actions step
- name: Check code quality
  run: npm run check
```

## File Patterns

### Included Files

- All `.ts`, `.tsx`, `.js`, `.jsx` files
- Configuration files (`*.config.*`)
- JSON files
- CSS/SCSS files

### Excluded Files

- `node_modules/**`
- `dist/**`, `build/**`, `out/**`
- `.next/**`, `.nuxt/**`, `.output/**`
- Coverage reports
- Lock files
- System files (`.DS_Store`, etc.)
- Minified files (`*.min.*`)

## Migration from ESLint/Prettier

### Replaced Tools

- **ESLint**: All linting now handled by Biome
- **Prettier**: All formatting now handled by Biome
- **eslint-config-prettier**: No longer needed
- **@typescript-eslint/parser**: Built into Biome

### Benefits

- **10-20x faster** than ESLint + Prettier
- **Single dependency** instead of multiple packages
- **Consistent configuration** across formatting and linting
- **Better TypeScript support** out of the box
- **Automatic import sorting**

### Migration Status

- ✅ Root configuration created
- ✅ Package.json scripts updated
- ✅ App-level scripts configured
- ✅ Existing code formatted
- ⚠️ Some linting rules require manual fixes
- ⚠️ ESLint configurations can be removed after full migration

## Common Issues and Solutions

### Async Functions Without Await

**Issue**: Functions marked `async` but don't use `await`
**Solution**: Remove `async` keyword if not needed, or add proper async logic

### Non-Null Assertions

**Issue**: Usage of `!` operator
**Solution**: Use proper type guards or optional chaining

### Any Types

**Issue**: Usage of `any` type
**Solution**: Use specific types or `unknown` with type guards

### Import Organization

**Issue**: Disorganized import statements
**Solution**: Run `npm run check:fix` to auto-organize imports

## Future Improvements

1. **Gradual Rule Adoption**: Enable nursery rules as they mature
2. **Custom Rules**: Add domain-specific rules for the project
3. **IDE Presets**: Create IDE-specific configuration files
4. **Performance Monitoring**: Track Biome performance in CI
5. **Rule Updates**: Regular updates to Biome rules and configuration

## Support and Resources

- **Biome Documentation**: https://biomejs.dev/
- **Rule Reference**: https://biomejs.dev/linter/rules/
- **Configuration Reference**: https://biomejs.dev/reference/configuration/
- **GitHub Discussions**: https://github.com/biomejs/biome/discussions

## Changelog

### Initial Setup (2025-10-24)

- Created comprehensive Biome configuration
- Replaced ESLint and Prettier scripts
- Applied initial formatting to codebase
- Updated .gitignore for better coverage
- Added development documentation

---

For questions or issues with the Biome configuration, please refer to the Biome documentation or open an issue in the project repository.