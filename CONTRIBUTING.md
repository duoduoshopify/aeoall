# Contributing to AEOall Pro

First off, thank you for considering contributing to AEOall Pro! 🎉

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates.

**When submitting a bug report, include:**
- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Browser and OS information
- Theme version

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues.

**When suggesting an enhancement, include:**
- A clear and descriptive title
- Detailed description of the proposed feature
- Why this enhancement would be useful
- Examples of how it would work

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code, add tests if applicable
3. Ensure your code follows the existing style
4. Run `shopify theme check` to validate
5. Update documentation as needed
6. Write a clear commit message

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/aeoall.git

# Add upstream remote
git remote add upstream https://github.com/duoduoshopify/aeoall.git

# Create a branch
git checkout -b feature/my-feature

# Make your changes
...

# Run theme check
shopify theme check

# Commit and push
git commit -m "Add my feature"
git push origin feature/my-feature
```

## Style Guide

### Liquid
- Use `{%- liquid -%}` tags for cleaner code
- Use `render` instead of `include`
- Add comments for complex logic
- Follow Shopify's Liquid best practices

### CSS
- Use CSS variables for theming
- Follow BEM naming convention
- Mobile-first approach
- Use rem units for sizing

### JavaScript
- Use Web Components where appropriate
- ES6+ syntax
- Add JSDoc comments
- Handle errors gracefully

## Commit Messages

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests

Examples:
- Add countdown timer block
- Fix variant picker on mobile
- Update README with new features

## Questions?

Feel free to ask in [GitHub Discussions](https://github.com/duoduoshopify/aeoall/discussions)!
