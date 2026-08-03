# Backend Development Patterns: Seat Release & Lifecycle Handling

This document tracks our progress and learnings in implementing a robust seat-holding and release mechanism in a modern full-stack application (React + Node.js/Express + Prisma).

## 1. Lazy Database Evaluation
**The Problem:** We wanted seats to automatically expire after 10 minutes. 
**The Learning:** Databases do not automatically update themselves when a timer hits zero. A database row for a seat will say `status: "HELD"` indefinitely until something actively triggers a change.
**The Solution:** We implemented "lazy evaluation" in `getSeatMap.ts`. When a user requests the seat map, the backend runs a quick `updateMany` to find any seats that are `HELD` but past their `expiryTime`, and resets them to `AVAILABLE` *before* returning the map. 

## 2. React Lifecycle & `useEffect` Cleanup
**The Problem:** We need to release a seat immediately if the user clicks a "Back" button to navigate away from the payment page.
**The Learning:** React's `useEffect` hook allows you to return a "cleanup function". This function is executed at the exact millisecond a component is unmounted (removed from the screen). 
**The Solution:** We attached a cleanup function to the `Booking.tsx` component that fires an API request to the backend to release the `selectedSeat` when the user leaves the page. By adding `[selectedSeat]` to the dependency array, we ensure the cleanup function always targets the most recently clicked seat.

## 3. Background Fetching & CORS Preflight (`beforeunload`)
**The Problem:** What if the user closes the entire browser tab? The `useEffect` cleanup might not have time to run, or the browser might aggressively cancel standard `axios` or `fetch` requests as the page dies.
**The Learning:** 
1. The `window.addEventListener('beforeunload', ...)` event catches full tab closures.
2. We must use `fetch` with the `keepalive: true` flag to tell the browser not to cancel the request when the tab closes.
3. **Advanced Gotcha:** If the frontend and backend are on different ports (e.g., Vite on 5173, Express on 3000), sending a request with an `Authorization: Bearer` header triggers an `OPTIONS` CORS preflight request. Browsers will almost always kill preflight requests during a tab close, meaning the actual `POST` request never reaches the backend. This makes full tab closures incredibly tricky to handle perfectly, which is why the 10-minute fallback timer from Step 1 is essential architecture!

## 4. Strict Prisma Syntax
**The Problem:** We tried to update a seat using `prisma.seat.update({ where: { id: seatId, status: "HELD" } })` and it silently crashed the backend.
**The Learning:** Prisma's `.update()` method is extremely strict and requires the `where` clause to contain *only* unique identifiers (like an `@id` UUID). It cannot filter on regular columns like `status`.
**The Solution:** To filter by a combination of a unique ID and a regular column, we must use `.updateMany()`, which allows completely flexible `where` clauses.

## 5. Real-Time Hot Reloading with WebSockets
**The Problem:** Short-polling the database every 3 seconds to check for seat updates is extremely inefficient and overloads the server.
**The Learning:** WebSockets (via `socket.io`) allow a persistent, bi-directional connection between the frontend and backend. Instead of the frontend constantly asking "Are there updates?", the backend simply pushes a message to the frontend *only* when an update occurs.
**The Solution:** 
1. We upgraded the Express app to use a raw Node.js `http.createServer`.
2. We attached `socket.io` to the server and configured CORS.
3. In our backend routes (like `seatStatusControl.ts` and `releaseSeat.ts`), we broadcasted an event: `io.emit('seatUpdate')`.
4. In our React frontend, we used a `useEffect` to establish the connection once on page load, listen for the `'seatUpdate'` event, and trigger `loadSeats()` to refetch the map. Crucially, we included a cleanup function (`socket.disconnect()`) to prevent memory leaks and infinite connections when the component unmounts.
