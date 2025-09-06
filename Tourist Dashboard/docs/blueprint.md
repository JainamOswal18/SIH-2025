# **App Name**: NE Safety Hub

## Core Features:

- Interactive Map: Display an interactive map centered on Northeast India using React-Leaflet and OpenStreetMap tiles.
- Tourist Route Visualization: Visualize the planned tourist route (Guwahati → Kaziranga → Shillong) as a blue polyline on the map.
- Draggable Tourist Marker: Implement a draggable marker to represent the tourist's current position on the map.
- Geo-fence Risk Zones: Overlay colored polygons on the map representing risk zones (red for high risk, yellow for moderate risk).
- Risk Alert System: Detect when the tourist marker enters a risk zone and display an alert with recommended actions, with the ability to use a reasoning tool that decides which actions are appropriate in different regions.
- Alert History Log: Maintain a sidebar event list logging all risk zone entries with timestamps.
- Safety Status Indicator: Indicate current safety status (Green/Yellow/Red) based on the tourist's location relative to risk zones.
- Periodic Safety Check-in Modal: Pop-up every 15 minutes requesting passcode entry
- Route Deviation Detection: Visual corridor (±2km buffer) around planned route with alerts
- Emergency Contact Panel: Quick-access emergency numbers and SOS button
- Trip Status Panel: Display trip duration, remaining time, next destination
- Safety Score Display: Live numerical score (0-10) based on current location risk factors
- Realistic Geo-fencing: Restricted tribal areas (red polygons), Forest boundaries (yellow polygons), Highway danger spots (orange circles), Safe zones around towns (green circles)
- Additional UI Components: Emergency SOS button (prominent, red), Language toggle (Hindi/English dropdown), Tourist profile card (name, ID, emergency contact), Real-time clock with trip countdown, Internet connectivity indicator

## Style Guidelines:

- Primary: Deep blue (#1E3A8A) - more official/trustworthy
- Background: Clean white (#FFFFFF) - better for data visibility
- Success: Green (#059669) - safe zones
- Warning: Amber (#D97706) - moderate risk
- Danger: Red (#DC2626) - high risk zones
- Accent: Orange (#EA580C) - alerts and CTAs
- Font: 'PT Sans', a humanist sans-serif providing a modern and accessible feel for both headlines and body text.
- Main map container (70% width), right sidebar (30% width) for controls and information.
- Use simple, clear icons for map markers, alerts, and emergency contacts.
- Subtle animations for marker movement and alert pop-ups to enhance user experience.