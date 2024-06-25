/** @param {string} data */
export function transpile(data: string) {
    let str = data
        .split("\n")
        .filter(line => line.trim() !== "")
        .join("\n");
    str = str.replaceAll("}", "");

    str = str.replaceAll(/[\t ]*interface (\w+) \{/g, "/** @typedef {Object} $1");
    str = str.replaceAll(/[\t ]*type (\w+) = \{/g, "/** @typedef {Object} $1");

    str = str.replaceAll(/[\t ]*(\w+): *([\w[\]]+)[;,]? *\/\/ *([a-zA-Zёа-яА-Я ]+\n?)\n*/g, " * @property {$2} $1 $3");
    str = str.replaceAll(/[\t ]*(\w+)\?: *([\w[\]]+)[;,]? \/\/ *([a-zA-Zёа-яА-Я ]+\n?)\n*/g, " * @property {$2 | undefined} $1 $3");

    str = str.replaceAll(/[\t ]*(\w+)\?: *([\w[\]]+)[;,\n]?\n*/g, " * @property {$2 | undefined} $1 \n");
    str = str.replaceAll(/[\t ]*(\w+): *([\w[\]]+)[;,\n]?\n*/g, " * @property {$2} $1 \n");

    return str + "*/\n";
}

const tests = [[
    `
interface Commit {
    id: string // уникальный идентификатор коммита
    timestamp: number, // время создания в миллисекундах
parents?: string[]; // массив id родительских коммитов
         message?: string; // сообщение коммита
\tbranches?: string[]; // массив имён веток
}
`,
    `/** @typedef {Object} Commit
 * @property {string} id уникальный идентификатор коммита
 * @property {number} timestamp время создания в миллисекундах
 * @property {string[] | undefined} parents массив id родительских коммитов
 * @property {string | undefined} message сообщение коммита
 * @property {string[] | undefined} branches массив имён веток
*/
`,
    "interface"], [
        `
        type Commit = {
    id: string, // уникальный идентификатор коммита
timestamp: number // время создания в миллисекундах
        parents?: string[]; // массив id родительских коммитов
    message?: string; // сообщение коммита
\tbranches?: string[]; // массив имён веток
}`, `/** @typedef {Object} Commit
 * @property {string} id уникальный идентификатор коммита
 * @property {number} timestamp время создания в миллисекундах
 * @property {string[] | undefined} parents массив id родительских коммитов
 * @property {string | undefined} message сообщение коммита
 * @property {string[] | undefined} branches массив имён веток
*/
`, "type"
]]


for (const test of tests) {
    const str = transpile(test[0]);

    console.assert(
        transpile(test[0]) === test[1],
        test[2]+"\ngot:\n"+transpile(test[0])+"\nbut required:\n"+test[1]);

    for(let i=0; i<str.length; i++) {
        if(str[i] !== test[1][i]) {
            console.log(i+ " err here: _"+JSON.stringify(str[i])+"_ !== _"+JSON.stringify(test[1][i])+"_");
            console.log("\t"+JSON.stringify(str.slice(i-5,i+5))+"_ !== _"+JSON.stringify(test[1].slice(i-5,i+5))+"_")
            break;
        }
    }
}
