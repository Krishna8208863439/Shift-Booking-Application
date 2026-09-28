# ShiftBook — React Native Mobile Application

ShiftBook is a fully functional React Native mobile application built with TypeScript, Expo, Styled Components, and React Navigation. It integrates with the Shift Booking Mock API to allow users to browse work shifts, filter by city, book shifts, view booked shifts, and cancel bookings with full server synchronization and backend validation.

---

## Features

- **Available Shifts Screen** — Browse all available (unbooked) shifts grouped by date with city filtering
- **My Shifts Screen** — View all currently booked shifts with date grouping and total hours summary
- **City Filtering** — Filter by Helsinki, Tampere, Turku, or All, with live shift counts per city
- **Date Grouping** — Shifts automatically grouped under Today, Tomorrow, and upcoming date headings
- **Chronological Sorting** — Shifts sorted by start time within each date group
- **Booking Flow** — Book eligible shifts with real-time API synchronization and loading state
- **Cancellation Flow** — Cancel booked shifts via confirmation dialog before sending the request
- **Overlap Detection** — Frontend mirrors backend validation: overlapping shifts are marked and unclickable
- **Status Awareness** — Shifts that have already started or finished are disabled in the UI
- **Loading States** — Animated SVG spinners matching the provided design assets during all API calls
- **Empty States** — Friendly empty state screens for both Available and My Shifts
- **Error Handling** — Banner errors with retry for network failures, timeout, and API errors
- **Pull-to-Refresh** — Refresh both screens by pulling down
- **Connection Status** — Live backend connectivity indicator in the app header
- **Responsive Layout** — Full phone experience on mobile; desktop/phone toggle on web browser

---

## Technology Stack

| Technology | Version | Purpose |
|---|---|---|
| React Native | 0.86.3 | Mobile framework |
| Expo SDK | ~57 | Build toolchain & development server |
| TypeScript | ~6.0.3 | Type safety |
| Styled Components | ^6.5.3 | Component styling |
| React Navigation | ^7 | Bottom tab navigation |
| Axios | ^1.20.0 | HTTP API client |
| @expo/vector-icons | ^15 | Ionicons for tab bar and UI icons |
| react-native-svg | ^15 | Animated SVG loading spinners |
| react-native-safe-area-context | ^5 | Safe area layout |
| Jest + ts-jest | ^30 | Unit testing |

---

## Project Structure

```
mobile/
├── App.tsx                    # Application entry point with all Providers
├── index.ts                   # Expo root component registration
├── app.json                   # Expo app configuration
├── package.json               # Dependencies and npm scripts
├── tsconfig.json              # TypeScript strict configuration
├── jest.config.js             # Unit test configuration
├── .env.example               # Environment variables template
└── src/
    ├── components/
    │   ├── AppHeader.tsx          # Brand bar, screen title, API status chip, refresh
    │   ├── CityFilter.tsx         # Scrollable city filter tabs with live counts
    │   ├── ConfirmationModal.tsx  # Cancellation confirmation dialog
    │   ├── DateSection.tsx        # Section header (date + shifts & hours summary)
    │   ├── EmptyState.tsx         # Empty state with icon, message, and action button
    │   ├── ErrorState.tsx         # Inline error banner + full-page error view
    │   ├── LoadingIndicator.tsx   # Animated SVG spinner (green/red/primary)
    │   ├── ResponsiveContainer.tsx# Desktop web sidebar + phone frame toggle
    │   ├── ShiftCard.tsx          # Shift row with time, city, status, Book/Cancel button
    │   └── StatusBadge.tsx        # Booked / Overlapping / Started / Finished label
    ├── context/
    │   └── ShiftContext.tsx       # Central state: shifts, loading, booking, errors
    ├── hooks/
    │   ├── useShifts.ts           # Reads shift data and query state from context
    │   └── useShiftActions.ts     # Exposes bookShift, cancelShift, isShiftActionLoading
    ├── navigation/
    │   └── AppNavigator.tsx       # Bottom tab navigator with booking badge
    ├── screens/
    │   ├── AvailableShiftsScreen.tsx  # Screen 1: Browse and book shifts
    │   └── MyShiftsScreen.tsx         # Screen 2: View and cancel booked shifts
    ├── services/
    │   ├── api.ts                 # Axios client, platform URL detection, error parser
    │   └── shiftsService.ts       # Typed wrappers for all 4 API endpoints
    ├── theme/
    │   ├── colors.ts              # Design-spec color palette
    │   ├── spacing.ts             # Spacing scale and border radii
    │   ├── typography.ts          # Font sizes, weights, line heights
    │   └── index.ts               # Aggregated theme export
    ├── types/
    │   └── shift.ts               # Shift, Area, ShiftGroup, ShiftActionStatus types
    └── utils/
        ├── dateUtils.ts           # Timestamp formatting, date headings, duration calc
        ├── shiftUtils.ts          # Grouping, sorting, filtering, overlap detection
        └── __tests__/
            ├── dateUtils.test.ts  # 8 unit tests for date utilities
            └── shiftUtils.test.ts # 13 unit tests for shift utilities
```

---

## Prerequisites

- **Node.js** ≥ 18.x  
- **npm** ≥ 9.x  
- **Expo CLI** (installed automatically via `npx expo`)  
- **Android Studio** with an AVD (Android Virtual Device) for emulator testing  
- OR **iOS Simulator** (macOS only)  
- OR **Expo Go** app on a physical iOS/Android device  

---

## Getting Started

### Step 1 — Start the Mock API Server

The mobile app connects to the Shift Booking Mock API which runs on port 8080. **Start the backend first**, from the project root directory:

```bash
# In the project root (Shift Booking Application/)
npm install
npm start
```

Expected output:
```
✅  API server is listening at http://0.0.0.0:8080
```

The API server must be running for the app to function. **Do not close this terminal.**

---

### Step 2 — Configure the API Base URL

The app auto-detects the correct host depending on the platform:

| Environment | API URL | Auto-detected? |
|---|---|---|
| **iOS Simulator** | `http://localhost:8080` | ✅ Yes |
| **Android Emulator** | `http://10.0.2.2:8080` | ✅ Yes |
| **Web Browser** | `http://localhost:8080` | ✅ Yes |
| **Physical Device (Expo Go)** | `http://<YOUR_LAN_IP>:8080` | ❌ Manual |

For a **physical device**, copy `.env.example` to `.env` inside the `mobile/` folder and set your computer's local network IP:

```bash
# Inside mobile/
cp .env.example .env
# Edit .env and set:
# EXPO_PUBLIC_API_URL=http://192.168.1.XXX:8080
```

> 💡 **Pro Tip**: You can also tap the status chip in the app header (top right corner) to change the API URL directly from within the running app — no rebuild required!

---

### Step 3 — Install Mobile Dependencies

```bash
cd mobile
npm install
```

---

### Step 4 — Start the Expo Development Server

```bash
cd mobile
npx expo start
```

Then launch on your chosen target:

- **Android Emulator** — Press `a` in the Expo terminal
- **iOS Simulator** — Press `i` in the Expo terminal  
- **Web** — Press `w` in the Expo terminal
- **Physical Device** — Open **Expo Go** and scan the QR code

---

## Android Emulator Setup

1. Install **Android Studio** from https://developer.android.com/studio
2. Open Android Studio → **More Actions** → **Virtual Device Manager**
3. Click **Create Device** → select **Pixel 7** (or similar) → choose API 34 system image → Finish
4. Start the AVD by clicking the ▶ Play button
5. In the Expo terminal, press `a` to deploy to the emulator

The app will auto-use `http://10.0.2.2:8080` for Android emulators.

---

## Physical Device Setup

1. Install **Expo Go** from the App Store or Google Play
2. Connect your phone to the **same Wi-Fi network** as your development computer
3. Find your computer's local IP address:
   - **Windows**: Run `ipconfig` in Command Prompt → look for IPv4 Address
   - **macOS**: System Settings → Network → Wi-Fi → IP Address
4. Set `EXPO_PUBLIC_API_URL=http://<YOUR_IP>:8080` in `mobile/.env`
5. Run `npx expo start` and scan the QR code with Expo Go

---

## API Integration

All API calls go through the centralized service layer:

| Endpoint | Method | Purpose |
|---|---|---|
| `/shifts` | GET | Fetch all shifts |
| `/shifts/{id}` | GET | Fetch a single shift |
| `/shifts/{id}/book` | POST | Book a shift |
| `/shifts/{id}/cancel` | POST | Cancel a shift |

**Backend validation rules** (enforced by both backend and frontend):
- Already booked shifts cannot be booked again
- Shifts that have already started cannot be booked
- Finished shifts cannot be booked
- Overlapping shifts (time conflicts with existing bookings) cannot be booked
- Only booked shifts can be cancelled

---

## Running Unit Tests

```bash
cd mobile
npm test
```

All 21 test cases pass:

```
PASS src/utils/__tests__/dateUtils.test.ts
PASS src/utils/__tests__/shiftUtils.test.ts

Test Suites: 2 passed, 2 total
Tests:       21 passed, 21 total
```

**Tests cover:**
- `formatTime` — 24-hour time formatting with leading zero padding
- `formatTimeRange` — Start/end time range display
- `getDateKey` — YYYY-MM-DD normalization for reliable grouping
- `formatDateHeading` — Today / Tomorrow / Month Day labeling
- `calculateDurationHours` — Integer and fractional hour calculations
- `formatShiftsSummary` — Singular/plural shift count formatting
- `sortShiftsChronologically` — Ascending start time sort
- `filterShiftsByCity` — All / Helsinki / Tampere / Turku filtering
- `isShiftOverlapping` — Overlap detection matching backend logic
- `getShiftStatus` — Full status derivation chain
- `groupShiftsByDate` — Date grouping with duration sums
- `getCityCounts` — Per-city and total count calculation

---

## TypeScript Check

```bash
cd mobile
npx tsc --noEmit
```

Expected: **no errors, exit code 0**.

---

## Troubleshooting

### "Unable to connect to the backend server"
- Ensure the Mock API is running: `npm start` from the project root
- Verify the server printed: `✅  API server is listening at http://0.0.0.0:8080`
- On Android emulator: the app uses `http://10.0.2.2:8080` automatically
- On a physical device: set `EXPO_PUBLIC_API_URL` to your LAN IP in `mobile/.env`
- Tap the status chip in the header to see the current server address and re-check

### "Metro bundler failed to start"
- Kill other Metro processes: `npx kill-port 8081`
- Clear the Expo cache: `npx expo start --clear`

### "Module not found" errors after `npm install`
```bash
cd mobile
rm -rf node_modules
npm install
```

### Android emulator shows blank screen
- Ensure your emulator has **API level 31+** installed
- Try shaking the device (or `Ctrl+M` in emulator) to open the developer menu
- Enable **Fast Refresh** from the developer menu

### Shifts show as "Started" immediately
- This is expected behavior — the mock API generates shifts relative to the current day/time
- Restart the API server (`npm start` in the project root) to regenerate fresh timestamps

---

## Design System

The design faithfully follows the provided `design-spec.pdf`:

| Token | Value | Usage |
|---|---|---|
| `primary` | `#004FB4` | Brand blue, tab bar active, buttons |
| `bookGreen` | `#16A64D` | Book button text, success spinner |
| `cancelRed` | `#E2006A` | Cancel button text, overlap label, error |
| `textPrimary` | `#4F6C92` | Shift times, headings |
| `textSecondary` | `#A4B8D3` | City labels, inactive tabs |
| `background` | `#F1F4F8` | Screen background |
| `cardBackground` | `#FFFFFF` | Shift card rows |
| `border` | `#CBD2E1` | Dividers, section borders |
