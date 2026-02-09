# SGL-Venezuela UI/UX Flows

## 1. Dashboard Flow (Home)

**Goal**: Instant gratification and operational awareness.

### Layout

- **Top Bar**: User Profile, Notifications (Bell icon for "Reguía Pending").
- **KPI Cards (Top Row)**:
  - `Net Profit Today`: Large green text (e.g., "$4,250.00").
  - `Active Trips`: Count of status 'In Transit'.
  - `Fleet Usage`: % of Chutos active.
- **Main View (Split Screen)**:
  - **Left Panel (Map)**: Interactive map showing trucks (Chutos) moving in real-time (mocked or real GPS). Color-coded: Green (On Time), Red (Delayed/Stopped).
  - **Right Panel (Recent Activity)**: Scrollable list of recent Order updates.

### key Interactions

- Click on a **Pin** on the map -> Opens "Quick Trip View" (Driver Name, Destination, current Profit).
- Click on **KPI Card** -> Navigates to dedicated Report page.

---

## 2. Order Creation Wizard (The "Happy Path")

**Goal**: Create a profitable trip in < 30 seconds.

### Step 1: Client & Destination

- **Input**: Search Client (Autofill).
- **Action**: Select Client -> Dropdown of `TBL_SITIOS_ENTREGA` appears.
- **Display**: On selection of Site, show "Site Contact: Juan Perez (0414-XXXXXXX)" immediately below to verify availability.
- **Next Button**: Active only if validation passes.

### Step 2: Resource Assignment

- **Input**: Select Transport Company.
- **Filter**: Dropdowns for Chuto, Batea, and Chofer are filtered to show only `ID_Transportista`'s assets AND Status='Active'.
- **Validation**: Prevent selecting a Chuto that is already 'In Transit'.

### Step 3: Financials & Review

- **Input Grid**:
  - `Selling Price` | `Quantity`
  - `Plant Cost`   | `Freight Cost` | `Labor` | `Other`
- **Real-Time Calculation**: As user types, a "Predicted Profit" badge updates dynamically in the bottom corner.
  - Green > $100
  - Yellow > $0 & < $100
  - Red < $0
- **Submit**: "Create Order" -> Generates `TBL_PEDIDOS` record -> Prints "Guía de Control" PDF.

---

## 3. Reguía Wizard (The "Exception Path")

**Goal**: Handle chaos efficiently.

### Trigger

- User locates an active Order (Status: 'In Transit') -> Clicks "Redirect/Reguía".

### Screen 1: The Alert

- **UI**: Red border/warning theme.
- **Input**: "Where is the truck NOW?" (Virtual Origin).
- **Input**: "Why are we diverting?" (Reason code/text).

### Screen 2: New Plan

- **Input**: Select `New_Delivery_Site`.
- **Question**: "Is the truck broken?" (Toggle Yes/No).
  - IF YES: Prompt to select `New_Chuto` / `New_Chofer` (Resource Rescue).
  - IF NO: Keep existing resources.

### Screen 3: Cost Adjustment

- **Input**: "Additional Freight Cost" (Extra payment to driver for the deviation).
- **Calc**: Shows `Original Profit` vs `New Profit` side-by-side.
- **Confirm**: "Issue Reguía" -> Updates Status -> Generates "Reguía de Circulación" PDF.
