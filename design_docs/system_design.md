# SGL-Venezuela System Design & Business Logic

## 1. Profitability & Financial Logic (The Core)

The system calculates profitability *per trip* (per `TBL_PEDIDOS` record). This logic is triggered whenever financial input fields are updated.

### Inputs (User Provided)

| Field | Description | Variable Name |
|-------|-------------|---------------|
| **Unit Price** | Selling price to Client (e.g., $120/ton) | `Selling_Price_Unit` |
| **Quantity** | Amount delivered (e.g., 28.5 tons) | `Quantity` |
| **Plant Cost** | Cost to buy from Plant (e.g., $40/ton) | `Plant_Cost_Unit` |
| **Freight** | Cost paid to Transportista (e.g., $600 flat) | `Freight_Cost_Total` |
| **Caleta** | Labor cost for loading/unloading (e.g., $50) | `Labor_Cost` |
| **Other** | Tolls, police, food, etc. | `Other_Costs` |

### Calculated Fields (FORMULAS)

#### A. Total Income (Gross Sales)

Note: VAT (IVA 16%) is usually added on top for invoicing but Profit is calculated on base.
$$ Total\_Income\_Excl\_VAT = Selling\_Price\_Unit * Quantity $$
$$ VAT\_Amount = Total\_Income\_Excl\_VAT * 0.16 $$
$$ Total\_Invoice\_Amount = Total\_Income\_Excl\_VAT + VAT\_Amount $$

#### B. Total Expense (Cost of Goods Sold + logistics)

$$ Cost\_Of\_Goods = Plant\_Cost\_Unit * Quantity $$
$$ Total\_Expense = Cost\_Of\_Goods + Freight\_Cost\_Total + Labor\_Cost + Other\_Costs $$

#### C. Net Profit

$$ Net\_Profit = Total\_Income\_Excl\_VAT - Total\_Expense $$

#### D. Warning Logic

IF `Net_Profit < 0` THEN
  TRIGGER "Negative Profit Alert" (UI Notification red banner)

---

## 2. Reguía (Cargo Redirection) Logic

A "Reguía" allows diverting a shipment that is already active (`In Transit`).

### Workflow Rules

1. **Trigger Condition**: Can only be created if Order Status is `In Transit` or `Reguia_Pending`.
2. **Locking**: The original `TBL_PEDIDOS` record is technically "fulfilled" regarding the pickup, but the delivery changes.
3. **Data Inheritance**:
   - New `TBL_REGUIAS` record is created.
   - Inherits `Original_Order_ID`.
4. **Change Management**:
   - IF `New_Chuto_ID` IS NOT NULL => Truck breakdown occurred, new vehicle assigned.
   - `Additional_Freight_Cost` must be added to the *Original Order's* Total Expense to reflect true profitability decrement.

### Revised Profitability with Reguía

$$ Total\_Expense_{final} = Total\_Expense_{original} + Additional\_Freight\_Cost_{reguia} $$

---

## 3. Reporting Logic

### A. Guía de Control (Driver Handout)

*Purpose*: Physical paper for the driver to show at checkpoints or delivery.
*Content*:

- Header: SGL-Venezuela Logo
- Client: `TBL_CLIENTES.Razon_Social`
- Origin: `TBL_PLANTAS.Name`
- Destination: `TBL_SITIOS_ENTREGA.Exact_GPS_Address` & `Alias_Obra`
- Contact: `TBL_SITIOS_ENTREGA.Site_Contact_Name` (`Phone`)
- Cargo: `Product_Name` - `Quantity`
- Transport: `Company_Name` - `Plate_Number` (Chuto) - `Plate_Number` (Batea)

### B. Reguía de Circulación (Legal Diversion)

*Purpose*: Legal proof that the truck is off-route due to valid reasons.
*Content*:

- "POR MEDIO DE LA PRESENTE SE AUTORIZA EL CAMBIO DE DESTINO..."
- Old Dest: `[Old Site Alias]`
- New Dest: `[New Site Alias]`
- Reason: `Reason_For_Diversion`
- Timestamp: `Reguia_Date`

### C. Liquidación de Viaje (Admin Only)

*Purpose*: Internal financial audit.
*Structure*: Table View.

- Columns: Date, Client, Route (Origin->Dest), Income, Expense, Profit.
- Footer: Sum of Net Profit for the period.
