import {parse} from "https://deno.land/std@0.114.0/flags/mod.ts";

export interface Args {
    [k: string]: string
}

export default abstract class GetArgs<T> {
    args: Args;

    constructor() {
        this.args = parse(Deno.args);
    }

    mustGet(args: Args, key: string): string {
        if (key in args) {
            return args[key];
        }
        throw new Error(`"${key}" is required`);
    }

    getInt(args: Args, key: string, defaultValue: number): number {
        if (key in args) {
            return parseInt(args[key]);
        }
        return defaultValue;
    }

    getString(args: Args, key: string, defaultValue: string): string {
        if (key in args) {
            return args[key];
        }
        return defaultValue;
    }

    abstract get(): T;
}