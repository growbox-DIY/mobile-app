# Installing the GrowBox app on an iPhone – guide for Claude

The person you are helping may not be technical. The goal: the GrowBox app
runs on their iPhone and shows live data from their GrowBox controller.
It is built on their Mac and installed over a cable, signed with their own
free Apple ID.

## How to talk

- Use the person's language. Short, plain sentences, one step at a time.
  No jargon; when a term is needed, explain it in a few words.
- Before each command, say in one sentence what it does. When macOS,
  Xcode or the iPhone shows a dialog, tell them exactly what to tap or
  click.
- Never ask for passwords in the chat. The Apple ID password only goes
  into Xcode, the Mac password only into a macOS dialog or the Terminal
  prompt, typed by the person.

## Rules

- The controller runs a live grow. Only read from it (`GET /api/config`).
  Never call anything that changes settings, relays or the watering log.
- The API token goes only into `.env` (git-ignored). Don't commit, push or
  open issues; the local changes to `app.json` stay uncommitted too.
- If a step fails twice, stop, explain it plainly and suggest asking in
  the GitHub issues of this repo.

## Steps

1. **Code.** If you are not inside a clone of this repo yet, run
   `git clone https://github.com/growbox-DIY/mobile-app.git` and work in
   that folder.
2. **Tools on the Mac.**
   - Xcode (`xcodebuild -version`). If missing: install Xcode from the
     App Store (large download), open it once, accept the license and let
     it install the iOS platform.
   - Node.js LTS (`node -v`). If missing: Homebrew (`brew install node`)
     if `brew` exists, otherwise the installer from nodejs.org.
   - CocoaPods (`pod --version`). If missing: `brew install cocoapods`.
3. **Apple ID in Xcode.** Xcode → Settings → Accounts → + → Apple ID. The
   person signs in there. A free Apple ID is enough.
4. **iPhone.** Connect it with a cable, unlock it and tap **Trust** on
   "Trust This Computer?". Turn on Developer Mode: Settings → Privacy &
   Security → Developer Mode → On; the iPhone restarts (the option appears
   after the phone has been connected to Xcode).
5. **Controller.** Ask for the API token (the person who set up the
   controller has it: `API_TOKEN` in the firmware's `src/api_token.py`)
   and the address. If they don't know the address, try
   `http://esp32.local`. Test it:
   `curl -s -m 5 -H "Authorization: Bearer <token>" <url>/api/config`.
   JSON with `config` = OK; 401 = wrong token; no answer = the Mac is not
   on the same WiFi, or try the controller's IP from the router.
6. **`.env`.** Copy `.env.example` to `.env`:
   `EXPO_PUBLIC_API_URL=<url>/api`, `EXPO_PUBLIC_API_TOKEN=<token>`,
   `EXPO_PUBLIC_OFFLINE_MODE=false`. These values are built into the app:
   a new token means building again. A new controller address does not;
   the app finds the controller on its own.
7. **Own identifiers.** In `app.json` set `ios.bundleIdentifier` and
   `android.package` to something unique, e.g. `com.<short-name>.growbox`
   (ask for a short name, lowercase letters only), and remove
   `extra.eas.projectId`.
8. **Build and install.** `npm install`, then
   `npx expo run:ios --device --configuration Release` and pick the
   iPhone. The first build takes a while. If signing fails ("requires a
   development team"): open `ios/*.xcworkspace` in Xcode, target → Signing
   & Capabilities → Team → their Personal Team, then run the command
   again. If Xcode says a capability is not available for a Personal
   Team, remove that capability there and tell the person what it
   affects.
9. **First start on the iPhone.** "Untrusted Developer": Settings →
   General → VPN & Device Management → their Apple ID → **Trust**. Then
   allow local network access and notifications (watering reminders).
10. **Check.** The app shows temperature and humidity. If it says
    offline, check that the phone is on the home WiFi and go back to
    step 5.
11. **Wrap up.** Explain the 7-day limit: with a free Apple ID the app
    stops opening after 7 days. To renew, connect the iPhone, open Claude
    in this folder and ask to reinstall the GrowBox app on the iPhone:
    run step 8 again (data on the phone is kept).
