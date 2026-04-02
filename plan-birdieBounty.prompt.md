## Plan: Birdie Bounty Implementation for Current Repo

TL;DR - The repo already has a matching auth + dashboard foundation. The plan is to extend the existing `server/` and `client/` apps with score management, charity state, protected auth flows, Stripe-based subscription activation, and an admin draw engine.

**Steps**
1. Backend: preserve the existing `server/models/Users.js` schema and confirm it supports `subscriptionStatus`, `scores`, and `charity`.
2. Backend: add new controllers and routes for scores, charity, draws, and payments.
   - Create `server/controllers/scoreController.js` with add-score logic, validation, and rolling-5 behavior.
   - Create `server/controllers/charityController.js` for charity selection + donation percentage.
   - Create `server/controllers/drawController.js` and `server/models/DrawResult.js` for admin draws.
   - Create `server/controllers/paymentController.js` and webhook handling for Stripe subscription activation.
3. Backend: add auth middleware.
   - `server/middlewares/authMiddleWare.js` to verify JWT and attach user payload.
   - `server/middlewares/adminMiddleWare.js` to restrict draw execution.
4. Backend: update routes.
   - `server/routes/authRoutes.js` stays and may gain a `/me` endpoint.
   - Add `server/routes/scoreRoutes.js`, `charityRoutes.js`, `adminRoutes.js`, and `paymentRoutes.js`.
5. Backend: update `server/server.js` to register the new routes and load Stripe config.
6. Frontend: build real auth integration.
   - Update `client/src/context/AuthContext.jsx` to store `user` and `token` from login/signup.
   - Implement API helper in `client/src/utils/api.js` or equivalent.
   - Add protected route behavior in `client/src/components/ProtectedRoute.jsx` and optional `AdminRoute.jsx`.
7. Frontend: enable login/signup.
   - Wire `client/src/pages/Login.jsx` and `SignUpPage.jsx` to POST to `/api/auth/login` and `/api/auth/register`.
   - Persist token locally, fetch current user data, and redirect to `/dashboard`.
8. Frontend: wire the dashboard to actual user data.
   - Load user status, scores, charity, and results from API.
   - Replace hardcoded values in `client/src/pages/Dashboard.jsx` with state-driven UI.
   - Implement `ScoresTab` with a score form validated 1-45 and an `Add Score` button that is disabled unless user is active.
   - Implement `CharityTab` with charity selection, donation slider (min 10%), and save functionality.
   - Implement `ResultsTab` to fetch and show draw results from `DrawResult`.
9. Frontend: add subscription flows.
   - Use Stripe checkout session creation and redirect for the `Subscribe` buttons.
   - Optionally add an intermediate `PlanCard` or `Payment` page.
10. Backend: admin draw engine.
   - Add admin route that generates 5 unique random numbers 1-45.
   - Iterate `User.find({ subscriptionStatus: { $in: ['monthly','yearly'] } })` and compute matches against stored scores.
   - Save draw results in `DrawResult` including numbers, user matches, and timestamp.

**Relevant files**
- `server/models/Users.js` — current schema already includes `subscriptionStatus`, `scores`, and `charity`.
- `server/controllers/authControllers.js` — keep existing JWT login/register logic and extend user payload.
- `server/routes/authRoutes.js` — current auth endpoints.
- `server/server.js` — main Express entrypoint.
- `client/src/context/AuthContext.jsx` — global auth state.
- `client/src/pages/Dashboard.jsx` — current scores/charity/results UI.
- `client/src/pages/Login.jsx` and `client/src/pages/SignUpPage.jsx` — login/signup forms.
- `client/src/App.jsx` — current route definitions.

**Verification**
1. Run backend and confirm auth endpoints still work with valid user registration/login.
2. Test score submission: active user can add scores, and a 6th score pushes oldest one out.
3. Test charity update: donation percentage saves and is constrained to >= 10.
4. Test protected dashboard routing: unauthenticated users cannot access `/dashboard`.
5. Verify Stripe webhook updates `subscriptionStatus` to active after simulated payment.
6. Run admin draw endpoint and confirm draw results persist in the database.

**Decisions / Assumptions**
- Use the existing JWT + bcrypt auth flow rather than integrating Clerk, because current repo already implements custom JWT.
- Use the existing `client/` and `server/` directories as the working app structure instead of renaming to `frontend/` and `backend/`.
- Stripe integration is included as a backend extension, but details like real checkout pages can be phased in after API and dashboard wiring.

**Further considerations**
1. Confirm whether the paid product should treat `subscriptionStatus` values `monthly` and `yearly` as both permitted for add-score, or if only a single `active` state is sufficient.
2. Decide whether `scores` should store a unique `id` field per score object, or use Mongoose’s default `_id`.
3. Determine if admin draw execution should be manual via a protected route or scheduled by a cron job/script.