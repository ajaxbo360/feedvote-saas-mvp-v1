# Development Rules and Guidelines for Feedvote.com

## Important Documentation References

Before making any development decisions, always consult these key documents:

1. **Custom Cursor AI Agent Rules** - Located in `.cursor/rules/Custom Rules and Guidelines for Cursor (AI Coding Agent) - Feedvote.com Development`

   - Contains comprehensive guidance for AI-assisted development
   - Defines Test-Driven Development (TDD) methodology requirements
   - Outlines coding standards and practices specific to this project

2. **Product Requirements Document (PRD)** - Located in `docs/prd/`

   - Contains complete product specifications
   - Defines features, requirements, and acceptance criteria
   - Any deviation from the PRD must be discussed with the product team

3. **User Flow Documentation** - Located in `docs/userflow/`

   - Illustrates user journeys through the application
   - Maps UI/UX interactions and desired outcomes
   - Reference when implementing user-facing features

4. **Development Tasks** - Located in `tasks/`
   - Contains prioritized work items
   - Defines technical implementation specifics
   - Outlines dependencies between tasks

## Development Standards

### Test-Driven Development (TDD)

- Follow Red-Green-Refactor cycle for all development
- Write tests BEFORE implementation code
- Implement in small, testable increments

### Code Quality

- Write clean, maintainable code with appropriate comments
- Follow TypeScript best practices with proper type definitions
- Use consistent naming conventions across components
- Implement comprehensive error handling

### Performance

- Optimize component rendering to minimize reflows
- Implement proper data fetching strategies with loading states
- Follow Next.js best practices for SSR/SSG where appropriate

### Testing

- Write unit tests for all business logic functions
- Create component tests for UI elements
- Test user flows against acceptance criteria
- Ensure accessibility compliance

### Git Workflow

- Use feature branches for all new development
- Create descriptive commit messages
- Submit PRs with appropriate documentation
- Link PRs to relevant tasks

### Deployment

- Verify builds in development environment before pushing
- Run all tests before deployment
- Document any configuration changes

## Decision Making Framework

1. Does this align with the PRD specifications?
2. Does this maintain or improve the user flows?
3. Is this consistent with existing implementation patterns?
4. Have edge cases been considered?
5. Is there a more efficient or maintainable approach?

## Continuous Improvement

Team members are encouraged to suggest improvements to these rules and other documentation files. Submit suggestions through:

1. Create an issue in the repository with the "documentation" label
2. Detail the proposed changes and rationale
3. Reference relevant sections of existing documentation
