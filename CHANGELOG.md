# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [3.0.0](https://gitlab.rankingcoach.com:222/d.stefancu/await-event-emitter/compare/v2.3.2...v3.0.0) (2023-08-23)


### ⚠ BREAKING CHANGES

* update package name and readme

### Features

* add prepended functions to currently running loop ([0e024fc](https://gitlab.rankingcoach.com:222/d.stefancu/await-event-emitter/commit/0e024fcc92fa48eb926fbd71e2a5c080e8e2ff78))


### Bug Fixes

* remove hardcoded types ([126c604](https://gitlab.rankingcoach.com:222/d.stefancu/await-event-emitter/commit/126c604d750914e3e2a4e4cfd1d38f7b611ec835))
* update package name and readme ([c681943](https://gitlab.rankingcoach.com:222/d.stefancu/await-event-emitter/commit/c681943f91a7ac21d95d3998960306ae02e30a5a))

### [2.3.2](https://gitlab.rankingcoach.com/d.stefancu/await-event-emitter/compare/v2.3.1...v2.3.2) (2021-05-22)


### Bug Fixes

* revert to cjs export ([b2b2982](https://gitlab.rankingcoach.com/d.stefancu/await-event-emitter/commit/b2b2982f838d86c271d6298f867d1c1d9433cc22))

### [2.3.1](https://gitlab.rankingcoach.com/d.stefancu/await-event-emitter/compare/v2.3.0...v2.3.1) (2021-05-22)


### Bug Fixes

* export to be compatibles with ESM ([41fdcc8](https://gitlab.rankingcoach.com/d.stefancu/await-event-emitter/commit/41fdcc8964386d682226020ebd29648231c45502))

## [2.3.0](https://gitlab.rankingcoach.com/d.stefancu/await-event-emitter/compare/v2.2.8...v2.3.0) (2021-03-28)


### Features

* **once:** allow removal of listeners in flight while maintaining the execution order ([0d8fb11](https://gitlab.rankingcoach.com/d.stefancu/await-event-emitter/commit/0d8fb111026da9a08c429dd1e7921e737753e1e5))


### Bug Fixes

* once listeners on emit ([f03f01c](https://gitlab.rankingcoach.com/d.stefancu/await-event-emitter/commit/f03f01cbee14f28ce80c97dec21e5e7bccbaab7a))

### [2.2.8](https://gitlab.rankingcoach.com/d.stefancu/await-event-emitter/compare/v2.2.7...v2.2.8) (2021-03-26)


### Bug Fixes

* removing of once listeners on emit ([ccad61b](https://gitlab.rankingcoach.com/d.stefancu/await-event-emitter/commit/ccad61bc457fa58fc660fbe41bc7c0a0bb893684))

### [2.2.7](https://gitlab.rankingcoach.com/d.stefancu/await-event-emitter/compare/v2.2.6...v2.2.7) (2021-03-24)


### Bug Fixes

* **once:** remove once listeners immediately after they run ([c21353e](https://gitlab.rankingcoach.com/d.stefancu/await-event-emitter/commit/c21353ee062beb2a6187b403df9865a861bfd264))

### [2.2.6](https://gitlab.rankingcoach.com/d.stefancu/await-event-emitter/compare/v2.2.5...v2.2.6) (2021-03-12)


### Bug Fixes

* build procedure wo files instruction ([bad5817](https://gitlab.rankingcoach.com/d.stefancu/await-event-emitter/commit/bad5817247cb17b644d8fe35811920b2e12520ad))

### [2.2.5](https://gitlab.rankingcoach.com/d.stefancu/await-event-emitter/compare/v2.2.4...v2.2.5) (2021-03-12)


### Bug Fixes

* build procedure with commonjs module ([b4a805d](https://gitlab.rankingcoach.com/d.stefancu/await-event-emitter/commit/b4a805d4fb0bdd6ee4f5fdccf8a606f4a5823e53))

### [2.2.4](https://gitlab.rankingcoach.com/d.stefancu/await-event-emitter/compare/v2.2.3...v2.2.4) (2021-03-12)


### Bug Fixes

* build tsc again ([54730ce](https://gitlab.rankingcoach.com/d.stefancu/await-event-emitter/commit/54730ce6b803895bc40db53a8090ef1a7b59e810))

### [2.2.3](https://gitlab.rankingcoach.com/d.stefancu/await-event-emitter/compare/v2.2.2...v2.2.3) (2021-03-12)


### Bug Fixes

* build tsc ([d3d82a3](https://gitlab.rankingcoach.com/d.stefancu/await-event-emitter/commit/d3d82a39f875057ca6bd1373ac1ebd282050f396))

### [2.2.2](https://gitlab.rankingcoach.com/d.stefancu/await-event-emitter/compare/v2.2.1...v2.2.2) (2021-03-12)


### Bug Fixes

* build procedure ([ef852b6](https://gitlab.rankingcoach.com/d.stefancu/await-event-emitter/commit/ef852b6aaf16462f024b5e48c86573b4289f2547))

### [2.2.1](https://gitlab.rankingcoach.com/d.stefancu/await-event-emitter/compare/v2.2.0...v2.2.1) (2021-03-12)


### Bug Fixes

* tsc after install, as it's unpublished ([b6899e3](https://gitlab.rankingcoach.com/d.stefancu/await-event-emitter/commit/b6899e34f59d0acda3e529f60fab46dccd2d7f27))

## [2.2.0](https://gitlab.rankingcoach.com/d.stefancu/await-event-emitter/compare/v2.0.2...v2.2.0) (2021-03-12)


### Features

* adjust emit to allow in flight removal of events ([5f7a888](https://gitlab.rankingcoach.com/d.stefancu/await-event-emitter/commit/5f7a888c4a0ad199ca5654509886716ff224dd4a))
* allow removeAllListeners to remove from specified event ([b6be841](https://gitlab.rankingcoach.com/d.stefancu/await-event-emitter/commit/b6be84194eb11917c2cbb12c083d639a3b584a9e))


### Bug Fixes

* husky lib to latest version ([7ee5e4d](https://gitlab.rankingcoach.com/d.stefancu/await-event-emitter/commit/7ee5e4d0f36f1019b016ee5f98741f82bd3f3d9e))

# [2.1.0](https://github.com/imcuttle/node-await-event-emitter/compare/v2.0.2...v2.1.0) (2021-03-04)

### Features

- adjust emit to allow in flight removal of events ([5f7a888](https://github.com/imcuttle/node-await-event-emitter/commit/5f7a888c4a0ad199ca5654509886716ff224dd4a))
- allow removeAllListeners to remove from specified event ([b6be841](https://github.com/imcuttle/node-await-event-emitter/commit/b6be84194eb11917c2cbb12c083d639a3b584a9e))

## [2.0.2](https://github.com/imcuttle/node-await-event-emitter/compare/v2.0.1...v2.0.2) (2020-11-24)

## [2.0.1](https://github.com/imcuttle/node-await-event-emitter/compare/v2.0.0...v2.0.1) (2020-11-03)

# 2.0.0 (2020-11-03)
