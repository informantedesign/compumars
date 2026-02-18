


export interface ReportConfig {
    issuerName: string;
    issuerRole: string;
    issuerId: string;
    companyName: string;
    companyRif: string;
    contactPhone: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function processTemplate(template: string, order: any, config: ReportConfig): string {
    if (!template) return "";
    let html = template;


    // Helper to safely get nested values or empty string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const get = (val: any, fallback = "") => (val !== undefined && val !== null ? String(val) : fallback);
    const upper = (val: string) => get(val).toUpperCase();

    // Current Date
    const currentDate = new Date().toLocaleDateString('es-VE', { day: '2-digit', month: 'long', year: 'numeric' });

    // Truck Data Parsing
    const truckBrand = order.truckBrand || (order.truck || "").split(' ')[0] || "MACK";
    const truckModel = order.truckModel || "GRANITE";
    const truckPlate = order.truckPlate || order.plate || "";
    const truckType = order.truckType || "CHUTO";
    const truckColor = order.truckColor || "BLANCO";

    // Trailer Data Parsing
    const trailerBrand = order.trailerBrand || "TAZA";
    const trailerModel = order.trailerModel || "PLATA.";
    const trailerPlate = order.trailerPlate || order.plate || ""; // Fallback if regular plate isn't distinct
    const trailerType = order.trailerType || "TANQUE";
    const trailerColor = order.trailerColor || "GRIS";

    // Quantity Parsing
    const qtyParts = get(order.quantity).split(' ');
    const quantityVal = qtyParts[0] || "0";
    const quantityUnit = (qtyParts.slice(1).join(' ') || "TON").toUpperCase();

    // REPLACEMENTS
    const replacements: Record<string, string> = {
        "{{DATE}}": currentDate,
        "{{PLANT_ORDER_NO}}": get(order.plantOrderNumber, order.id),

        // Client - Prioritize Final Client/Address from Reguia
        "{{CLIENT_NAME}}": get(order.finalClient) || get(order.client),
        "{{CLIENT_CODE}}": get(order.clientCode),
        "{{CONSIGNEE_CODE}}": get(order.consigneeCode),
        "{{CLIENT_RIF}}": get(order.rif), // We might need updates.rif too if we want dynamic RIF
        "{{CLIENT_PHONE}}": get(order.phone),

        // Destination - Prioritize Final Address
        "{{DESTINATION_ADDRESS}}": get(order.destinationDetail) || get(order.finalAddress) || get(order.destination),
        "{{DESTINATION_STATE}}": upper(order.destinationState || " - "),
        "{{DESTINATION_MUNICIPALITY}}": upper(order.destinationMunicipality || " - "),
        "{{DESTINATION_PARISH}}": upper(order.destinationParish || " - "),
        "{{ORIGIN}}": upper(order.origin || ""),
        "{{ROUTE}}": get(order.route),

        // Driver
        "{{DRIVER_NAME}}": get(order.driver),
        "{{DRIVER_ID}}": get(order.driverCedula) || "V-11.976.272 (MOCK)", // Use saved Cedula or fallback

        // Truck
        "{{TRUCK_BRAND}}": upper(truckBrand),
        "{{TRUCK_MODEL}}": upper(truckModel),
        "{{TRUCK_PLATE}}": upper(truckPlate),
        "{{TRUCK_TYPE}}": upper(truckType),
        "{{TRUCK_COLOR}}": upper(truckColor),

        // Trailer
        "{{TRAILER_BRAND}}": upper(trailerBrand),
        "{{TRAILER_MODEL}}": upper(trailerModel),
        "{{TRAILER_PLATE}}": upper(trailerPlate),
        "{{TRAILER_TYPE}}": upper(trailerType),
        "{{TRAILER_COLOR}}": upper(trailerColor),

        // Product
        "{{PRODUCT_NAME}}": upper(order.product || ""),
        "{{QUANTITY}}": get(order.quantity),
        "{{QUANTITY_VAL}}": quantityVal,
        "{{QUANTITY_UNIT}}": quantityUnit,

        // Issuer / Config
        "{{ISSUER_NAME}}": get(config.issuerName),
        "{{ISSUER_ROLE}}": get(config.issuerRole),
        "{{ISSUER_ID}}": get(config.issuerId),
        "{{COMPANY_NAME}}": get(config.companyName),
        "{{COMPANY_RIF}}": get(config.companyRif),
        "{{CONTACT_PHONE}}": get(config.contactPhone),
    };

    // Apply all replacements
    for (const [key, value] of Object.entries(replacements)) {
        // Replace all occurrences
        html = html.split(key).join(value);
    }

    return html;
}
