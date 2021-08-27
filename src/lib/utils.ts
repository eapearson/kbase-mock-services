import { anyToJSONValue, JSONValue } from "/json.ts";
import { ensureDirSync, } from "https://deno.land/std@0.103.0/fs/mod.ts";
import { walkSync } from "https://deno.land/std@0.103.0/fs/mod.ts";

export function saveJSON(dest: string, module: string, name: string, obj: any) {
    const output = JSON.stringify(anyToJSONValue(obj), null, 4);
    const dir = `${dest}/${module}`;
    ensureDirSync(dir);
    Deno.writeTextFile(`${dir}/${name}`, output);
}

export async function getJSON(directory: string, moduleName: string, name: string): Promise<JSONValue> {
    const fileName = `${name}.json`;
    const path = new URL(fileName, `file://${directory}/${moduleName}/`).pathname;
    const resultData = JSON.parse(await Deno.readTextFile(path));
    return (resultData as unknown) as JSONValue;
}

export function getFiles(directory: string, moduleName: string, filter: (path: string) => boolean): Array<string> {
    const path = `${directory}/${moduleName}/`;
    const found: Array<string> = [];
    for (const entry of walkSync(path)) {
        if (entry.isFile && filter(entry.name)) {
            found.push(entry.name);
        }
    }
    return found;
}