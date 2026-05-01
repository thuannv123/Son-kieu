# TECHNICAL SPECIFICATION: ECO-TOURISM RESORT WEBSITE (AMF-ECO)

## 1. PROJECT OVERVIEW
- **Project Name:** Eco-Resort Management System
- **Core Activities:** Cave exploration, Lake swimming, Sightseeing tours.
- **Target:** B2C platform for booking and information.

## 2. SYSTEM ARCHITECTURE & TECH STACK (RECOMMENDED)
- **Frontend:** Next.js (App Router), Tailwind CSS.
- **Backend:** Node.js / Python (FastAPI).
- **Database:** PostgreSQL (Supabase) for structured data.
- **Cache:** Redis for booking availability.
- **Storage:** Cloudinary/S3 for high-quality images & 360 virtual tours.

## 3. CORE FUNCTIONALITIES & LOGIC

### 3.1. Content Management System (CMS)
- **Module [Sightseeing]:** - Fields: Title, Description, Safety Guidelines, Difficulty Level (for Caves), Virtual Tour Link.
- **Module [Activities]:**
    - Lake Swimming: Real-time capacity monitoring.
    - Cave Tours: Slot-based management (Max pax per hour).

### 3.2. Booking Engine (Critical)
- **Booking Flow:** Select Activity -> Choose Date/Time -> Check Availability -> Input Info -> Payment -> QR Code Issuance.
- **Validation Logic:** - Cave tours require a 1:10 guide-to-guest ratio.
    - Lake activities depend on weather API status (Auto-disable booking if "Rain/Storm").
- **QR Code Generation:** Generate unique UUID-based QR for each ticket for gate check-in.

### 3.3. Weather Integration
- **API:** OpenWeatherMap API.
- **Feature:** Display 7-day forecast on Homepage. Trigger alert banners for cave safety if water levels are high.

### 3.4. Interactive Map
- **UI:** SVG Map or Mapbox integration.
- **Points of Interest (POI):** Dynamic markers for Caves, Swimming Pools, Restaurants, and Emergency Stations.

## 4. DATABASE SCHEMA (ERD)

### Table: `activities`
- `id`: UUID (PK)
- `name`: String (Cave A, Lake B...)
- `category`: Enum (CAVE, LAKE, SIGHTSEEING)
- `max_capacity`: Integer
- `price`: Decimal

### Table: `bookings`
- `id`: UUID (PK)
- `user_id`: UUID (FK)
- `activity_id`: UUID (FK)
- `booking_date`: Date
- `slot_time`: Time
- `status`: Enum (PENDING, PAID, CANCELLED, CHECKED_IN)
- `qr_code_url`: String

### Table: `weather_logs`
- `id`: BigInt
- `status`: String
- `is_safe`: Boolean
- `updated_at`: Timestamp

## 5. API ENDPOINTS (RESTFUL)

### Public API:
- `GET /api/activities`: Fetch all resort spots.
- `GET /api/availability?date=YYYY-MM-DD&activity_id=...`: Check slots.
- `POST /api/booking/create`: Submit booking request.

### Admin API:
- `POST /api/admin/check-in`: Scan QR code and update status.
- `PUT /api/admin/toggle-safety`: Manually close cave/lake in emergencies.

## 6. NON-FUNCTIONAL REQUIREMENTS
- **Performance:** Images must be WebP format with lazy loading.
- **SEO:** Metadata for each cave/activity for Google Search ranking.
- **Security:** JWT Authentication for Admin, SSL for payments.