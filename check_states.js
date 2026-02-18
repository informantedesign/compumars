const fs = require('fs');
const data = require('./src/lib/venezuela.json');

const states = data.map(s => s.estado);
console.log(states.join('\n'));
console.log(`Total: ${states.length}`);
