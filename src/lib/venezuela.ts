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

export const VENEZUELA_DATA: State[] = (rawData as any[]).map(s => ({
    name: s.estado,
    municipalities: s.municipios.map((m: any) => ({
        name: m.municipio,
        parishes: m.parroquias
    }))
}));
