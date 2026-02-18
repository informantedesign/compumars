import rawData from "./venezuela.json";

export type Parish = string;

export type Municipality = {
    name: string;
    parishes: Parish[];
};

export type State = {
    name: string;
    municipalities: Municipality[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const VENEZUELA_DATA: State[] = (rawData as any[]).map(s => ({
    name: s.estado,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    municipalities: s.municipios.map((m: any) => ({
        name: m.municipio,
        parishes: m.parroquias
    }))
})).sort((a, b) => {
    return a.name.localeCompare(b.name);
});
