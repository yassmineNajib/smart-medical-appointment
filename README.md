# Smart Medical Appointment

A multilingual React and Vite frontend created for a summer hackathon. It provides medical-appointment search, booking confirmation, attendance confirmation, cancellation, and calendar-oriented appointment views.

## Run locally

1. Install Node.js LTS.
2. Copy `.env.example` to `.env`.
3. Replace the example automation endpoint URLs with your own non-secret webhook endpoints.
4. Install and start the project:

```bash
npm install
npm run dev
```

Create a production build with:

```bash
npm run build
```

## Workflow template

`workflows/Confirm Medical Appointment.template.json` preserves the workflow structure but has had credentials and secrets redacted. Import it into the relevant automation platform, then add credentials there through that platform's secret-management interface.

## Security

- Never commit `.env`.
- Do not place passwords, API keys, or private tokens in `VITE_` variables; frontend variables are visible to browser users.
- Keep any real workflow export outside the repository, or store it only as an encrypted private backup.
