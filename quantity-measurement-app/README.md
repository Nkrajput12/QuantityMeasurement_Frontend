# QuantityMeasurement Angular Frontend

A modern Angular 17 frontend for the QuantityMeasurement .NET API.

## Features

- **Guest Access** — Convert, Add, Subtract, Divide, and Compare measurements without logging in
- **Protected History** — History page requires authentication (JWT)
- **Auth Flow** — Register / Login / Logout with JWT token stored in localStorage
- **4 Categories** — Length, Weight, Volume, Temperature
- **5 Operations** — Convert, Add, Subtract, Divide, Compare

## Tech Stack

- Angular 17 (Standalone Components)
- RxJS
- JWT via HTTP Interceptor
- Route Guard for `/history`

## Prerequisites

- Node.js ≥ 18
- Angular CLI: `npm install -g @angular/cli`
- Your .NET backend running at `http://localhost:5149`

## Setup

```bash
# Install dependencies
npm install

# Start dev server
ng serve
```

Then open `http://localhost:4200`

## API Base URL

The API base URL is configured in:
- `src/app/services/auth.service.ts` → `http://localhost:5149/api/Auth`
- `src/app/services/measurement.service.ts` → `http://localhost:5149/api/Measurement`

Change these to match your backend URL.

## CORS

Your .NET backend currently allows `http://localhost:5500`. Update `Program.cs` to also allow `http://localhost:4200`:

```csharp
policy.WithOrigins(
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "http://localhost:4200"   // Add this
)
```

## Project Structure

```
src/app/
├── app.component.ts          # Root component
├── app.config.ts             # App providers (router, http, animations)
├── app.routes.ts             # Route definitions
├── models/
│   └── measurement.model.ts  # Interfaces + unit/operation constants
├── services/
│   ├── auth.service.ts       # Login, Register, Logout, JWT storage
│   └── measurement.service.ts# All API calls (convert/add/subtract/etc)
├── interceptors/
│   └── auth.interceptor.ts   # Attaches Bearer token to requests
├── guards/
│   └── auth.guard.ts         # Redirects unauthenticated users from /history
└── components/
    ├── navbar/               # Top navigation bar
    ├── converter/            # Main converter UI (public)
    ├── history/              # History viewer (auth-protected)
    └── auth/
        ├── login/            # Login form
        └── register/         # Registration form
```

## Routes

| Path        | Access  | Description             |
|-------------|---------|-------------------------|
| `/`         | Public  | Converter (all ops)     |
| `/history`  | Auth    | View operation history  |
| `/login`    | Public  | Sign in                 |
| `/register` | Public  | Create account          |
