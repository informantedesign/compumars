
export interface TripDetail {
    id: string;
    plantOrderNumber?: string;
    client: string;
    rif: string;
    route?: string;
    origin?: string;
    destination?: string;
    driver: string;
    driverPhone?: string;
    driverCedula?: string; // Added for reports
    truck?: string;
    plate?: string;
    status?: string;
    eta?: string;
    deliveryDate?: string;
    product?: string;
    quantity?: string;
    contact?: string;
    phone?: string;
    history?: any[];
    freightPrice?: number;
    plantCost?: number;
    driverPayment?: number;
    otherExpenses?: number;
    finalClient?: string;
    finalAddress?: string;

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
}
