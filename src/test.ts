abstract class Foo {
    abstract foo(x: string): string;
}

class Bar {
    foo(x: string) {
        return 'hi: ' + x;
    }
}