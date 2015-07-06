import resolver from './helpers/resolver';
import { factorySetup } from 'ember-data-tiny-factory/setup/mocha';
import { setResolver } from 'ember-mocha';

setResolver(resolver);
factorySetup({
    modulePrefix: 'ember-data-tiny-factory',
    resolver: resolver
});
factorySetup({
    modulePrefix: 'dummy',
    resolver: resolver
});
