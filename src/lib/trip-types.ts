
export interface TripDetail {
    id: string;
    plantOrderNumber?: string;
    client: string;
    clientCode?: string; // New
    consigneeCode?: string; // New
    rif: string;
    route?: string;
    origin?: string;
    destination?: string;
    driver: string;
    driverPhone?: string;
    driverCedula?: string; // Added for reports
    salesOrderNumber?: string; // Manual Contract Number
    truck?: string;
    plate?: string;
    status?: string;
    eta?: string;
    deliveryDate?: string;
    product?: string;
    quantity?: string;
    loaded_quantity?: string; // Real quantity loaded at plant
    unitPlantCost?: number; // Cost per unit at plant
    contact?: string;
    phone?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    history?: any[];
    freightPrice?: number;
    plantCost?: number;
    driverPayment?: number;
    otherExpenses?: number;
    finalClient?: string;
    finalAddress?: string;

    // Structured Destination (New)
    destinationState?: string;
    destinationMunicipality?: string;
    destinationParish?: string;
    destinationDetail?: string;

    // Truck specifics
    truckBrand?: string;
    truckModel?: string;
    truckPlate?: string;
    truckColor?: string;
    truckType?: string;

    // Trailer specifics
    trailerBrand?: string;
    trailerModel?: string;
    trailerPlate?: string;
    trailerColor?: string;
    trailerType?: string;

    // Payment Registration
    paymentMethod?: string;
    paymentReference?: string;
    paymentStatus?: 'Pendiente' | 'Pagado' | 'Parcial';
    paymentComment?: string;
    paymentDate?: string;

    // Seller Info
    sellerId?: string;
    sellerName?: string;

    // Multi-payments
    payments?: Payment[];

    // Address History
    addressHistory?: AddressSnapshot[];
}

export interface AddressSnapshot {
    type: 'CREACION' | 'REGUIA' | 'DESTINO_FINAL';
    date: string;
    address: string;
    state?: string;
    municipality?: string;
    siteId?: string;
    authorizedBy?: string;
    reason?: string;
}

export interface Payment {
    date: string;
    method: string;
    reference: string;
    amount: number;
    currency: 'USD' | 'Bs';
    exchangeRate?: number;
    comment?: string;
}
