-- SGL-Venezuela Database Schema
-- Optimized for PostgreSQL

-- 1. TBL_CLIENTES (Fiscal Entity)
CREATE TABLE TBL_CLIENTES (
    ID_Cliente SERIAL PRIMARY KEY,
    Razon_Social VARCHAR(255) NOT NULL,
    RIF VARCHAR(20) UNIQUE NOT NULL, -- Tax ID
    Fiscal_Address TEXT NOT NULL,
    Admin_Phone VARCHAR(50),
    Email VARCHAR(100),
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. TBL_SITIOS_ENTREGA (Delivery Sites)
CREATE TABLE TBL_SITIOS_ENTREGA (
    ID_Sitio SERIAL PRIMARY KEY,
    Client_Ref_ID INTEGER REFERENCES TBL_CLIENTES(ID_Cliente) ON DELETE CASCADE,
    Alias_Obra VARCHAR(100) NOT NULL, -- Friendly name for the site
    Exact_GPS_Address TEXT, -- Lat/Long or Description
    Site_Contact_Name VARCHAR(100),
    Site_Contact_Phone VARCHAR(50),
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. TBL_TRANSPORTISTAS (Companies)
CREATE TABLE TBL_TRANSPORTISTAS (
    ID_Transportista SERIAL PRIMARY KEY,
    Company_Name VARCHAR(255) NOT NULL,
    RIF VARCHAR(20) UNIQUE NOT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. TBL_FLOTA_CHUTOS (Truck Heads)
CREATE TABLE TBL_FLOTA_CHUTOS (
    ID_Chuto SERIAL PRIMARY KEY,
    Transportista_Ref_ID INTEGER REFERENCES TBL_TRANSPORTISTAS(ID_Transportista) ON DELETE CASCADE,
    Plate_Number VARCHAR(20) UNIQUE NOT NULL,
    Brand VARCHAR(50),
    Status VARCHAR(20) DEFAULT 'Active' CHECK (Status IN ('Active', 'Maintenance', 'Inactive')),
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. TBL_FLOTA_BATEAS (Trailers)
CREATE TABLE TBL_FLOTA_BATEAS (
    ID_Batea SERIAL PRIMARY KEY,
    Transportista_Ref_ID INTEGER REFERENCES TBL_TRANSPORTISTAS(ID_Transportista) ON DELETE CASCADE,
    Plate_Number VARCHAR(20) UNIQUE NOT NULL,
    Type VARCHAR(50), -- e.g., 'Platform', 'Bulk', 'Silo'
    Status VARCHAR(20) DEFAULT 'Active' CHECK (Status IN ('Active', 'Maintenance', 'Inactive')),
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. TBL_CHOFERES (Drivers)
CREATE TABLE TBL_CHOFERES (
    ID_Chofer SERIAL PRIMARY KEY,
    Transportista_Ref_ID INTEGER REFERENCES TBL_TRANSPORTISTAS(ID_Transportista) ON DELETE SET NULL,
    Name VARCHAR(100) NOT NULL,
    ID_Card_Cedula VARCHAR(20) UNIQUE NOT NULL,
    Phone VARCHAR(50),
    Status VARCHAR(20) DEFAULT 'Active',
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. TBL_PLANTAS (Origins)
CREATE TABLE TBL_PLANTAS (
    ID_Planta SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Location TEXT,
    Base_Product_Price_Unit DECIMAL(12, 2) DEFAULT 0, -- Default price, can be overridden per order
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. TBL_PEDIDOS (Orders)
-- Central transaction table
CREATE TABLE TBL_PEDIDOS (
    ID_Pedido SERIAL PRIMARY KEY,
    Order_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ID_Planta INTEGER REFERENCES TBL_PLANTAS(ID_Planta),
    ID_Cliente INTEGER REFERENCES TBL_CLIENTES(ID_Cliente),
    ID_Sitio_Entrega INTEGER REFERENCES TBL_SITIOS_ENTREGA(ID_Sitio),
    
    -- Assignment
    ID_Transportista INTEGER REFERENCES TBL_TRANSPORTISTAS(ID_Transportista),
    ID_Chuto INTEGER REFERENCES TBL_FLOTA_CHUTOS(ID_Chuto),
    ID_Batea INTEGER REFERENCES TBL_FLOTA_BATEAS(ID_Batea),
    ID_Chofer INTEGER REFERENCES TBL_CHOFERES(ID_Chofer),
    
    -- Cargo Details
    Product_Name VARCHAR(100), -- Cement Type
    Quantity DECIMAL(10, 2) NOT NULL, -- Tons or Units
    Unit_Type VARCHAR(20) DEFAULT 'Tons', 
    
    Status VARCHAR(50) DEFAULT 'Loading' CHECK (Status IN ('Loading', 'In Transit', 'Delivered', 'Reguia_Pending', 'Cancelled')),
    Notes TEXT
);

-- 9. TBL_FINANZAS_VIAJE (Profitability)
-- 1:1 Relationship with TBL_PEDIDOS
CREATE TABLE TBL_FINANZAS_VIAJE (
    ID_Finanza SERIAL PRIMARY KEY,
    ID_Pedido INTEGER UNIQUE REFERENCES TBL_PEDIDOS(ID_Pedido) ON DELETE CASCADE,
    
    -- Inputs
    Selling_Price_Unit DECIMAL(12, 2) NOT NULL, -- Price charged to client
    Plant_Cost_Unit DECIMAL(12, 2) NOT NULL, -- Cost paid to plant
    
    Freight_Cost_Total DECIMAL(12, 2) DEFAULT 0, -- Flete paid to generic transport or own cost
    Labor_Cost DECIMAL(12, 2) DEFAULT 0, -- Caleta
    Other_Costs DECIMAL(12, 2) DEFAULT 0, -- Peajes, Viaticos
    VAT_Rate DECIMAL(5, 2) DEFAULT 16.0, -- %

    -- Computed fields are usually managed by views or application logic, 
    -- but storing the snapshot of the calculation is good for historical accuracy.
    Total_Income_Excl_VAT DECIMAL(12, 2),
    Total_Expense DECIMAL(12, 2),
    Net_Profit DECIMAL(12, 2),
    
    Currency VARCHAR(3) DEFAULT 'USD'
);

-- 10. TBL_REGUIAS (Cargo Redirection)
-- Handles diversions. If an order is diverted, a record is created here.
CREATE TABLE TBL_REGUIAS (
    ID_Reguia SERIAL PRIMARY KEY,
    Original_Order_ID INTEGER REFERENCES TBL_PEDIDOS(ID_Pedido),
    
    Reguia_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Reason_For_Diversion TEXT,
    
    -- The "New Origin" is conceptually the location where the diversion happened, 
    -- but logically it continues from the original flow.
    Virtual_Origin_Location TEXT, 
    
    -- New Destination
    New_Delivery_Site_ID INTEGER REFERENCES TBL_SITIOS_ENTREGA(ID_Sitio),
    
    -- In case of breakdown, resources might change
    New_Chuto_ID INTEGER REFERENCES TBL_FLOTA_CHUTOS(ID_Chuto),
    New_Batea_ID INTEGER REFERENCES TBL_FLOTA_BATEAS(ID_Batea),
    New_Chofer_ID INTEGER REFERENCES TBL_CHOFERES(ID_Chofer),
    
    -- Costs adjustments
    Additional_Freight_Cost DECIMAL(12, 2) DEFAULT 0,
    Administrative_Fee DECIMAL(12, 2) DEFAULT 0
);

-- Indexes for performance
CREATE INDEX idx_pedidos_client ON TBL_PEDIDOS(ID_Cliente);
CREATE INDEX idx_pedidos_date ON TBL_PEDIDOS(Order_Date);
CREATE INDEX idx_pedidos_status ON TBL_PEDIDOS(Status);
CREATE INDEX idx_sitios_client ON TBL_SITIOS_ENTREGA(Client_Ref_ID);
CREATE INDEX idx_chutos_transportista ON TBL_FLOTA_CHUTOS(Transportista_Ref_ID);
