# Leucine Assignment UI

Equipment Cleaning Log is a React and TypeScript frontend for managing equipment, recording cleaning activities, and reviewing field-level audit history.

## Features

- View equipment in a paginated table.
- Filter equipment by active or inactive status.
- Create, edit, and delete equipment records.
- View the cleaning history for an equipment record.
- Create and edit cleaning logs, including status, method, notes, and cleaning date.
- View a grouped audit trail showing what changed, who changed it, and when.
- Display loading, error, and success feedback in the UI.

## Tech stack

- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [React Router](https://reactrouter.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Axios](https://axios-http.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vitest](https://vitest.dev/)
- [Oxlint](https://oxc.rs/docs/guide/usage/linter)

## Prerequisites

- Node.js 18 or newer
- npm 9 or newer
- A running backend API available at `http://localhost:5000/api`

The API base URL is currently configured in [`src/api/axios.ts`](./src/api/axios.ts). The frontend does not currently read this value from an environment variable.

## Getting started

Clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd leucine_assignment_ui
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will print the local URL in the terminal, usually `http://localhost:5173`.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server with hot module replacement. |
| `npm run build` | Type-check the project and create a production build in `dist/`. |
| `npm run preview` | Serve the production build locally after running `npm run build`. |
| `npm run lint` | Run Oxlint. |
| `npm test` | Run the Vitest test suite once. |
| `npm run test:watch` | Run Vitest in watch mode. |

## Application routes

| Route | Description |
| --- | --- |
| `/` | Equipment list and equipment management actions. |
| `/cleaning` | Paginated cleaning records for the equipment selected on the previous screen. |
| `/audit` | Field-level audit history for the selected cleaning record. |

The cleaning and audit screens expect navigation state from the preceding screen. Open them through the relevant **View** action in the application rather than navigating directly to the URL.

## Backend API contract

The frontend calls the following endpoints relative to `http://localhost:5000/api`:

### Equipment

- `GET /equipments/?page=<page>&limit=<limit>&active=<boolean>` — list equipment.
- `POST /equipments/create` — create equipment.
- `PUT /equipments/:id` — update equipment.
- `DELETE /equipments/:id` — delete equipment.

Equipment creation and update payloads contain:

```json
{
  "name": "Mixer",
  "code": "MX-001",
  "status": "active"
}
```

### Cleaning records

- `GET /cleaning/:equipmentId?page=<page>&limit=<limit>` — list cleaning records for equipment.
- `POST /cleaning/create` — create a cleaning record.
- `PATCH /cleaning/:id` — update a cleaning record.
- `GET /cleaning/get_record/:id` — retrieve a cleaning record and its audit history.

Cleaning creation payloads contain fields such as `cleanedBy`, `cleanedAt`, `method`, `notes`, `status`, and `eq_id`. Cleaning status is either `pending` or `verified`.

## Project structure

```text
src/
├── api/         Axios client and backend request functions
├── components/  Shared UI components, tables, dialogs, and forms
├── hooks/       TanStack Query hooks for equipment and cleaning data
├── pages/       Routed equipment, cleaning, audit, and layout screens
├── types/       TypeScript API and domain types
└── utils/       Shared utilities and their tests
```

## Testing

Run the existing unit tests with:

```bash
npm test
```

The audit grouping utility is covered by [`src/utils/groupAuditEntries.test.ts`](./src/utils/groupAuditEntries.test.ts).

## Production build

Create a production build and preview it locally:

```bash
npm run build
npm run preview
```

When deploying, configure the hosting platform to serve `index.html` for client-side routes so that `/cleaning` and `/audit` continue to work after a page refresh.
