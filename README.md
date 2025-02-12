# ShellLogix Test Task – Crypto Watchlist CRUD Functionality in React Native

## Project Status

**Task Completed:** All requirements have been implemented and tested successfully.

---

## Objective

Develop a Watchlist Management feature in a React Native application, allowing users to create, edit, delete, and manage multiple watchlists for cryptocurrency tracking.

## Figma Reference

[Click here to view the Figma design.](https://www.figma.com/design/yRZ6JPKMU7ufH9cMcm3ois/ShellLogix-React-Native-Test-Task?node-id=0-1&t=CmJJqkZx4sp6jO13-1)

## Requirements

1. **Watchlist CRUD Operations**

   - **Create**: Users can create a new watchlist with a name, avatar/icon, and initial coins.
   - **Read**: Users can view a list of saved watchlists. Each watchlist displays its name, icon, and number of coins. Selecting a watchlist shows its coins (ticker and price) fetched from an open-source API (CoinGecko).
   - **Update**: Users can rename watchlists, add/remove coins, and reorder coins via drag-and-drop.
   - **Delete**: Users can delete a watchlist.

2. **Share Watchlist**

   - Users should be able to share a watchlist (name and coin list) as text.

3. **Home Screen (Simplified)**

   - No fully-fledged Home Screen is required; just a simple selection to pick the active watchlist.
   - Fetch coin data from an open-source API (CoinGecko).

4. **UI & Responsiveness**

   - Layout should be responsive for small, medium, and large screens.

5. **Testing**

   - Ensure the app works on both Android and iOS.
   - Test watchlists with varied scenarios (creating multiple watchlists, edge cases, etc.).

6. **APK & iOS Build**
   - Provide an APK for Android testing.
   - Confirm the app runs on iOS and outline steps to run on a device or simulator.

---

## Required Stack

- **React Native (Expo)**
- **Redux Toolkit** (for state management)
- **CoinGecko** for live coin data

---

## How to Set Up and Run the Code

1. **Clone the Repository**

   ```bash
   git clone git@github.com:EroSargsyan/shell-logix-crypto.git
   ```

2. **Navigate to the Project Directory**

   ```bash
   cd shell-logix-crypto
   ```

3. **Install Dependencies**

   ```bash
   npm install
   ```

   This will install all required packages, including React, React Native, React Navigation, Redux Toolkit, etc.

4. **Run for Android**

   - Ensure you have an Android emulator running or an Android device connected via USB.
   - Run:
     ```bash
     npm run start
     ```
     then press "a" button to run on Android

5. **Run for iOS**

   - Make sure you have Xcode installed and an iOS simulator running or a physical iOS device connected.
   - Install pods if required:
     ```bash
     cd ios && pod install && cd ..
     ```
   - Start the development server and build the iOS app:
     ```bash
      npm run start
     ```
     then press "i" button to run on iOS

6. **Testing the App**
   - Verify watchlist creation, viewing, editing, and deletion.
   - Confirm coin data is fetched in real-time from CoinGecko.
   - Check responsiveness on different screen sizes.

---

## Video Demo

Include a video demonstrating:

1. Creating a watchlist (add a name, avatar/icon, and initial coins).
2. Viewing watchlists and coin data.
3. Editing a watchlist (rename, reorder coins, add/remove coins).
4. Deleting a watchlist.
5. Sharing the watchlist (text share).

_(https://www.dropbox.com/scl/fi/jd7744hl289870q11l3dg/Screen-Recording-2025-02-12-194326.mp4?rlkey=0nelep3ti0iwrtd397nplszcz&st=2yxg9s54&dl=0)_

---

## API Reference

- [CoinGecko API](https://docs.coingecko.com/v3.0.1/reference/introduction)

---

## Submission & Additional Notes

1. **Submission**

   - Provide GitHub repository link with a clear commit history.
   - Include the demo video link in your submission.
   - Provide an APK download link for Android testing.
   - Confirm iOS instructions if the tester wants to run on a physical device or simulator.

2. **Code Quality**
   - Maintain a clean, modular approach for future scalability.

---

**Thank you for reviewing this test task!**

```

```
