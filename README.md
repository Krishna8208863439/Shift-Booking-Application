# ShiftBook — React Native Shift Booking Application

ShiftBook is a React Native mobile application built with TypeScript, Expo, Styled Components, and React Navigation. It connects to the provided Shift Booking Mock API to allow users to browse work shifts, filter shifts by city, book shifts, view booked shifts, and cancel bookings with real-time backend synchronization and validation.

---

## Project Structure

```
.
├── api/                             # Mock backend API (Hapi 17 server)
│   ├── README.md                    # API endpoint documentation
│   ├── server.js                    # Server entry point
│   └── shifts-mock-api/             # Routes, in-memory DB, and shift dataset
├── assets/                          # Original SVG assets (spinner_green, spinner_red)
├── design-spec.pdf                  # Official visual design specification
├── package.json                     # Root backend package configuration
├── package-lock.json
└── mobile/                          # Complete React Native mobile application
    ├── App.tsx                      # Root App component
    ├── app.json                     # Expo configuration
    ├── package.json                 # Mobile dependencies
    ├── tsconfig.json                # TypeScript strict config
    ├── jest.config.js               # Jest unit test configuration
    ├── .env.example                 # API base URL configuration example
    ├── README.md                    # Mobile specific documentation
    └── src/
        ├── components/              # Reusable UI components
        ├── context/                 # ShiftContext single source of truth
        ├── hooks/                   # Custom query & mutation hooks
        ├── navigation/              # Bottom tab navigation
        ├── screens/                 # AvailableShifts & MyShifts screens
        ├── services/                # Axios API client & endpoints
        ├── theme/                   # Exact design spec color tokens
        ├── types/                   # TypeScript interfaces
        └── utils/                   # Date grouping, sorting, filtering & unit tests
```

---

## 1. Starting the Mock API

From the project root:

```bash
npm install
npm start
```

The API server will listen on port `8080`: `http://0.0.0.0:8080`.

### Documented API Endpoints
- `GET  /shifts` — Returns all shifts
- `GET  /shifts/{id}` — Returns a single shift by ID
- `POST /shifts/{id}/book` — Books a shift (validates against overlaps, past shifts, and duplicate booking)
- `POST /shifts/{id}/cancel` — Cancels a booked shift

---

## 2. Starting the Mobile Application

In a separate terminal, navigate into the `mobile/` directory:

```bash
cd mobile
npm install
npx expo start
```

### Running Options:
- **Android Emulator**: Press `a` in the terminal
- **iOS Simulator**: Press `i` in the terminal (macOS)
- **Physical Device**: Scan the QR code using the **Expo Go** app (iOS/Android)
- **Web Preview**: Press `w` in the terminal

---

## 3. Network Configuration for Different Devices

The API runs on port `8080`. Depending on how you run the mobile app, set `EXPO_PUBLIC_API_URL` in `mobile/.env`:

| Device / Environment | URL | Details |
|---|---|---|
| **Android Emulator** | `http://10.0.2.2:8080` | Android emulators route `10.0.2.2` to the host computer |
| **iOS Simulator** | `http://localhost:8080` | Shares localhost with the computer |
| **Physical Mobile Device** | `http://<YOUR_COMPUTER_IP>:8080` | Use your computer's local Wi-Fi IP (e.g., `http://192.168.1.150:8080`) |

> You can also tap the API chip in the header of the running application to change the server URL on the fly!

---

## 4. Running Unit Tests

Unit tests are included for date grouping, date formatting, duration calculation, city filtering, and overlap detection:

```bash
cd mobile
npm test
```

All 21 unit tests pass with 100% success.

