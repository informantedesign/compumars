import { VENEZUELA_DATA } from "./venezuela";

export const MOCK_PLANTS = [
    {
        id: "PL-01", name: "Planta Pertigalete", location: "Anzoátegui", capacityGranel: 5000, capacitySacos: 20000, status: "Operativo", type: "Producción", manager: "Ing. Roberto Gomez", phone: "0281-1234567",
        products: [
            { productId: "PROD-001", defaultQuantity: "600" }, // Cemento Saco
            { productId: "PROD-002", defaultQuantity: "30" }  // Cemento Granel
        ]
    },
    {
        id: "PL-02", name: "Planta San Sebastián", location: "Aragua", capacityGranel: 3000, capacitySacos: 15000, status: "Mantenimiento", type: "Centro Dist.", manager: "Lic. Maria Perez", phone: "0243-9876543",
        products: [
            { productId: "PROD-003", defaultQuantity: "1000" } // Pego
        ]
    },
    {
        id: "PL-03", name: "Centro de Distribución Catia", location: "Caracas", capacityGranel: 0, capacitySacos: 50000, status: "Operativo", type: "Distribución", manager: "Sr. Carlos Ruiz", phone: "0212-5550000",
        products: [
            { productId: "PROD-001", defaultQuantity: "450" }
        ]
    },
];

export const MOCK_PRODUCTS = [
    { id: "PROD-001", name: "Cemento Portland Tipo I", presentation: "Sacos", unit: "kg", weight: "42.5" },
    { id: "PROD-002", name: "Cemento Granel Industrial", presentation: "Granel", unit: "Ton", weight: "1" },
    { id: "PROD-003", name: "Pego Gris Estándar", presentation: "Sacos", unit: "kg", weight: "10" },
    { id: "PROD-004", name: "Yeso Construcción", presentation: "Sacos", unit: "kg", weight: "20" },
];

export const MOCK_CLIENTS = [
    {
        id: 1,
        name: "Constructora Sambil",
        rif: "J-3049293-1",
        phone: "0212-555-9988",
        addresses: [
            { id: "addr-1", state: "Distrito Capital", municipality: "Libertador", parish: "Candelaria", detail: "Av. Urdaneta, Edif. Sambil", postalCode: "1010", isFiscal: true }
        ]
    },
    {
        id: 2,
        name: "Viviendas Venezuela",
        rif: "J-4099221-0",
        phone: "0241-555-1234",
        addresses: [
            { id: "addr-2", state: "Carabobo", municipality: "Valencia", parish: "San José", detail: "Urb. El Viñedo, Torre V", postalCode: "2001", isFiscal: true }
        ]
    },
    {
        id: 3,
        name: "Inversiones El Lago",
        rif: "J-9922112-3",
        phone: "0261-555-0000",
        addresses: []
    },
];

export const MOCK_DRIVERS = [
    { id: 1, name: "Pedro Perez", cedula: "V-15.223.111", license: "5ta", status: "Active", phone: "0414-1112233" },
    { id: 2, name: "Juan Rodriguez", cedula: "V-12.998.222", license: "5ta", status: "Active", phone: "0424-5556677" },
    { id: 3, name: "Carlos Mendez", cedula: "V-20.111.999", license: "5ta", status: "On Leave", phone: "0412-9998877" },
];

export const MOCK_TRANSPORTERS = [
    { id: 0, name: "INDEPENDIENTES", rif: "J-00000000-0", contact: "N/A", phone: "N/A", type: "Genérico" },
    { id: 1, name: "Transportes Los Andes", rif: "J-30123456-0", contact: "Sr. Luis", phone: "0414-1112222", type: "Empresa" },
    { id: 2, name: "Logística Central", rif: "J-40987654-1", contact: "Sra. Ana", phone: "0424-3334444", type: "Cooperativa" },
];

export const MOCK_CHUTOS = [
    { id: 1, plate: "A21-BC2", brand: "Mack", model: "Granite", year: "2015", status: "Active", color: "BLANCO", type: "CHUTO" },
    { id: 2, plate: "X99-ZZ1", brand: "Iveco", model: "Trakker", year: "2018", status: "Maintenance", color: "AZUL", type: "CHUTO" },
    { id: 3, plate: "B11-AA3", brand: "Mack", model: "Vision", year: "2012", status: "Active", color: "ROJO", type: "CHUTO" },
];

export const MOCK_BATEAS = [
    { id: 1, plate: "BAT-001", type: "Plataforma", capacity: "30 Ton", status: "Active", brand: "TAZA" },
    { id: 2, plate: "BAT-002", type: "Granelera", capacity: "32 Ton", status: "Active", brand: "RANDON" },
    { id: 3, plate: "BAT-003", type: "Lowboy", capacity: "40 Ton", status: "Maintenance", brand: "FREIGHT" },
];

export const MOCK_SELLERS = [
    { id: "V-000", name: "Oficina", commission: 0, phone: "N/A" },
    { id: "V-001", name: "Juan Pérez", commission: 5, phone: "0412-1234567" },
    { id: "V-002", name: "María Gómez", commission: 3, phone: "0414-9876543" },
];

export function generateRandomOrders(count: number) {
    const orders = [];
    const statuses = ["Cargando", "En Ruta", "En Sitio", "Completado", "Cancelado"];
    const products = ["CEMENTO GRIS", "CEMENTO BLANCO", "PEGAMENTO GRIS", "YESO", "CAL"];

    for (let i = 0; i < count; i++) {
        const client = MOCK_CLIENTS[Math.floor(Math.random() * MOCK_CLIENTS.length)];
        const driver = MOCK_DRIVERS[Math.floor(Math.random() * MOCK_DRIVERS.length)];
        const chuto = MOCK_CHUTOS[Math.floor(Math.random() * MOCK_CHUTOS.length)];
        const batea = MOCK_BATEAS[Math.floor(Math.random() * MOCK_BATEAS.length)];
        const seller = MOCK_SELLERS[Math.floor(Math.random() * MOCK_SELLERS.length)];

        let address = "Dirección Desconocida";
        if (client.addresses && client.addresses.length > 0) {
            const addrObj = client.addresses[0];
            address = typeof addrObj === 'string' ? addrObj : (addrObj.detail || "Dirección Desconocida");
        }

        orders.push({
            id: `VIA-${1000 + i}`,
            plantOrderNumber: `PL-${Math.floor(Math.random() * 90000) + 10000}`,
            client: client.name,
            rif: client.rif,
            route: "Pertigalete -> Caracas",
            origin: "Planta Pertigalete",
            destination: address,
            finalClient: client.name,
            finalAddress: address,
            driver: driver.name,
            driverCedula: driver.cedula,
            driverPhone: driver.phone || "0414-1234567",
            truck: `${chuto.brand} ${chuto.model}`,
            plate: chuto.plate,
            truckBrand: chuto.brand, truckModel: chuto.model, truckPlate: chuto.plate, truckColor: chuto.color, truckType: "CHUTO",
            trailerBrand: batea.brand || "TAZA", trailerModel: batea.type || "REMOLQUE", trailerPlate: batea.plate, trailerColor: "GRIS", trailerType: batea.type,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            eta: `${Math.floor(Math.random() * 12) + 1}h ${Math.floor(Math.random() * 60)}m`,
            deliveryDate: new Date().toLocaleDateString('es-VE'),
            product: products[Math.floor(Math.random() * products.length)],
            quantity: `${Math.floor(Math.random() * 30) + 10} Toneladas`,
            contact: "Encargado de Obra",
            phone: client.phone,
            history: [],
            sellerId: seller.id,
            sellerName: seller.name,
            freightPrice: Math.floor(Math.random() * 500) + 1000,
            plantCost: Math.floor(Math.random() * 300) + 200,
            driverPayment: Math.floor(Math.random() * 200) + 100,
            otherExpenses: Math.floor(Math.random() * 50)
        });
    }
    return orders;
}
