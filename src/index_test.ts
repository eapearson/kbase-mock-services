import {main} from './index.ts';
import {assert} from "https://deno.land/std@0.114.0/testing/asserts.ts";

Deno.test('The main entrypoint happy paths', () => {
    assert(main)
})