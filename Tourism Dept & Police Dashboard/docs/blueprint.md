# **App Name**: NE Tourism Department & Police Dashboard

## Core Features:

- Dashboard Toggle: Enable users to switch between the Police and Tourism Department dashboards for tailored views.
- Interactive Map Display: Show a map centered on Northeast India using React-Leaflet with OpenStreetMap, displaying tourist density via marker clustering and risk zones as a heatmap overlay.
- Critical Alerts Section: Create a sidebar panel that shows real-time emergency alerts including SOS calls, safety check failures, route deviations and alerts for tourists who are reported missing.
- Real-time Tourist Status: Update the real-time tourist status with details of total active tourists, alerts, and risk factors of their respective location.
- AI Route Anomaly Detection: Implement an AI-powered tool that automatically analyzes tourist routes and sends alerts if they deviate from planned itineraries, identifying potential risks.
- Incident Report Generation: Provide a user interface (UI) allowing police to enter incidents into a structured form that includes issue type, location, time, severity level, and description for centralized incident reporting.
- Tourist Profile Cards: Implement clickable map markers that open detailed modal popups showing complete tourist information including blockchain verification status, trip itinerary, emergency contacts, and medical flags.
- Advanced Alert Categorization: Create color-coded alert panels with specific icons - Red for SOS, Orange for check-in failures, Yellow for route deviations, Purple for missing tourists with timestamp tracking.
- Automated e-FIR System: Build a comprehensive e-FIR generation form that auto-populates with selected tourist data, includes all mandatory legal fields, and generates downloadable PDF reports for official use.
- Department Toggle Logic: Ensure Police dashboard emphasizes emergency response and law enforcement tools, while Tourism dashboard focuses on crowd management and visitor experience analytics.
- Realistic Northeast Mock Data: Include sample tourists with authentic Indian names, UK/foreign visitors, actual NE destinations (Kaziranga, Shillong, Tawang), and varied emergency scenarios for demo purposes.
- 4-Tier Alert System: Implement a 4-tier alert system: CRITICAL (Red), HIGH (Orange), MEDIUM (Yellow), INFO (Purple), each with distinct visual styling and auto-escalation timers.
- Live Demo Simulation: Add live demo simulation features: Auto-update tourist locations, simulate new alerts, mock safety check-in prompts, demonstrate e-FIR generation, and show blockchain verification changes.
- Police Dashboard Priority Features: Quick dispatch buttons, officer assignment and tracking, evidence upload capability, and case status management for the Police Dashboard.
- Tourism Dashboard Priority Features: Crowd density analytics, popular destination insights, tourist satisfaction metrics, and resource allocation recommendations for the Tourism Dashboard.

## Style Guidelines:

- Primary color: Navy blue (#1E3A8A) for official/government feel.
- Background color: Light gray (#F8FAFC) for a clean professional look.
- Accent color: Teal (#008080) as an alternative to standard 'info' blue.
- Body and headline font: 'Inter', a sans-serif font, for a modern and neutral look. Note: currently only Google Fonts are supported.
- Map Container: Use 70% width for the map with full-height display.
- Alert Sidebar: Use 30% width with scrollable panels.