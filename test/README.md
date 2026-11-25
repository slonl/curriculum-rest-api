# Tests

## Unit Tests

The `unit/` directory contains unit tests written in [Jest][1].

Tests for [Node.js][2] facing code under `src/` live in the `unit/src/` folder.

Tests for browser facing code under `www/assets/js/` live in the `unit/js/` folder.

Test living in the root of this directory are legacy test, written in [TAP][3].
These should eventually be migrated to Jest.

[1]: https://jestjs.io/
[2]: https://nodejs.org/
[3]: https://testanything.org/
