try {
    const rawData = require('./src/lib/venezuela.json');
    console.log("Loaded rawData, length:", rawData.length);

    const VENEZUELA_DATA = rawData.map(s => ({
        name: s.estado
    })).sort((a, b) => {
        if (a.name === "Distrito Capital") return -1;
        if (b.name === "Distrito Capital") return 1;
        return a.name.localeCompare(b.name);
    });

    console.log("Total States:", VENEZUELA_DATA.length);
    console.log("First 5 states after sort:");
    VENEZUELA_DATA.slice(0, 5).forEach((s, i) => console.log(`${i}: ${s.name}`));

    const dc = VENEZUELA_DATA.find(s => s.name === "Distrito Capital");
    console.log("Distrito Capital found?", !!dc);
} catch (e) {
    console.error("Error:", e.message);
}
