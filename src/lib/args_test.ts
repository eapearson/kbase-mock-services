import GetArgs from "./args.ts";
import {assertThrows} from "https://deno.land/std@0.114.0/testing/asserts.ts";
import {assert} from "https://deno.land/std@0.114.0/_util/assert.ts";

interface MyArgs {
    foo: string;
    bar: number;
}

class MyArgsGetter extends GetArgs<MyArgs> {
    get(): MyArgs {
        return {
            foo: this.mustGetString('foo'),
            bar: this.mustGetInt('bar')
        }
    }
}

Deno.test('GetArgs getInt happy paths', () => {
    const args = [
        '--foo', 'bar', '--bar', '123'
    ];
    const myArgs = new MyArgsGetter(args);

    // Get args that should exist
    assert(myArgs.getString('foo', 'baz') === 'bar');
    assert(myArgs.getInt('bar', 345) === 123);

    assert(myArgs.mustGetString('foo') === 'bar');
    assert(myArgs.mustGetInt('bar') === 123);
})

Deno.test('GetArgs getInt default values', () => {
    const args = [
        '--foo', 'bar', '--bar', '123'
    ];
    const myArgs = new MyArgsGetter(args);

    // Get args that should exist
    assert(myArgs.getString('fee', 'baz') === 'baz');
    assert(myArgs.getInt('boo', 345) === 345);
})

Deno.test('GetArgs which must but do not exist', () => {
    const args = [
        '--foo', 'bar', '--bar', '123'
    ];
    const myArgs = new MyArgsGetter(args);

    // Get args that must exist, but don't
    assertThrows(() => {
        myArgs.mustGetString('fee')
    }, Error);

    assertThrows(() => {
        myArgs.mustGetInt('boo')
    }, Error);
})

Deno.test('GetArgs getInt for string', () => {
    const args = [
        '--foo', 'bar'
    ];
    const myArgs = new MyArgsGetter(args);

    // Get args that must exist, but don't
    assertThrows(() => {
        myArgs.mustGetInt('foo')
    }, Error);
})

Deno.test('GetArgs getInt for float should fail', () => {
    const args = [
        '--baz', '1.23'
    ];
    const myArgs = new MyArgsGetter(args);


    assertThrows(() => {
        myArgs.mustGetInt('baz')
    }, Error);
})