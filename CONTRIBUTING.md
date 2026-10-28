# Contributing to ArtiGate

Thank you for your interest in improving ArtiGate. Contributions of all sizes are welcome: bug reports, documentation fixes, tests and new features.

## Before you start

- Read the [README](README.md) to understand the workflow, the architecture and the [known limitations](README.md#known-limitations).
- Search the [existing issues](https://github.com/azevedo1z/ArtiGate/issues) to avoid duplicates.
- For security vulnerabilities, do **not** open a public issue. Follow the [security policy](SECURITY.md) instead.

## Reporting bugs

Open a [bug report](https://github.com/azevedo1z/ArtiGate/issues/new?template=bug_report.yml) with:

- What you expected to happen and what happened instead
- Steps to reproduce
- Environment details (Node.js version, operating system, payment mode)
- Relevant logs or error responses, with secrets and personal data removed

## Suggesting improvements

Open a [feature request](https://github.com/azevedo1z/ArtiGate/issues/new?template=feature_request.yml) describing the problem you want to solve and the proposed solution. For larger changes, such as anything listed under known limitations, discuss the approach in an issue before writing code. This avoids duplicated or conflicting work.

## Setting up the development environment

Follow the [Getting started](README.md#getting-started) section of the README. Running with `ENABLE_PAYMENT_MOCK=true` (backend) and `VITE_ENABLE_PAYMENT_MOCK=true` (frontend) lets you exercise the whole workflow without Mercado Pago credentials.

## Submitting a pull request

1. Fork the repository and create a branch from `main`.
2. Follow the existing structure. In the backend, a new use case usually means:
   - a DTO and a service in `backend-api/src/app/application/`
   - a port in `backend-api/src/app/interface/`
   - an adapter in `backend-api/src/app/infrastructure/` when it touches an external resource (database, gateway, file system, HTTP service)
   - the wiring in the feature module under `backend-api/src/app/modules/`
3. Keep domain rules in `domain/` free of framework dependencies.
4. Add or update unit tests for the behavior you change.
5. Run the checks locally:

   ```bash
   npx nx run-many -t lint test typecheck
   ```

6. Format the code with Prettier (configuration in `.prettierrc`).
7. If you change the database schema, include the Prisma migration:

   ```bash
   npx prisma migrate dev --name <short-description>
   ```

8. If you add or change an environment variable, update `.env.example`, the validation schema in `backend-api/src/app/config/config.validation.ts` and the configuration reference in the README.
9. Open the pull request against `main`, filling in the pull request template.

## Commit messages

Please write commit messages in the [Conventional Commits](https://www.conventionalcommits.org) style, as used in most of the project history:

```
feat(payment): add refund support
fix(article): reject PDFs above the configured size
docs: clarify webhook configuration
```

Common types: `feat`, `fix`, `refactor`, `test`, `docs`, `style`, `chore`.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
