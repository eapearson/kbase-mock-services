import {Args, parse} from "https://deno.land/std@0.114.0/flags/mod.ts";


export default abstract class GetArgs<T> {
    args: Args;

    constructor(args: Array<string>) {
        this.args = parse(args);
    }

    // String

    private getStringArg(key: string): string | undefined {
        return this.args[key];
    }

    public mustGetString(key: string): string {
        const value = this.getStringArg(key);
        if (typeof value === 'undefined') {
            throw new Error(`"${key}" is required`);
        }
        return value;
    }

    public getString(key: string, defaultValue: string): string {
        const value = this.getStringArg(key);
        if (typeof value === 'undefined') {
            return defaultValue;
        }
        return value;
    }

    // Integer

    private getIntArg(key: string): number | undefined {
        if (key in this.args) {
            const value = parseInt(this.args[key]);
            if (Number.isNaN(value)) {
                throw new Error(`Arg "${key}" is not a number`);
            }
            if (value !== parseFloat(this.args[key])) {
                throw new Error(`Arg "${key}" is not an integer`);
            }

            return value;
        }
        return undefined;
    }

    public mustGetInt(key: string): number {
        const value = this.getIntArg(key);
        if (typeof value === 'undefined') {
            throw new Error(`"${key}" is required`);
        }
        return value;
    }

    public getInt(key: string, defaultValue: number): number {
        const value = this.getIntArg(key);
        if (typeof value === 'undefined') {
            return defaultValue;
        }
        return value;
    }

    abstract get(): T;
}