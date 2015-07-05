import resolver from './helpers/resolver';
import { setResolver } from 'ember-mocha';
import { beforeEach, afterEach } from 'mocha';
import ModelFactory from 'ember-data-tiny-factory';

setResolver(resolver);

ModelFactory.setResolver(resolver);
ModelFactory.configure({
    resolver: resolver,
    modulePrefix: 'dummy'
});

beforeEach(function(){
    ModelFactory.setup();
});

afterEach(function(){
    ModelFactory.teardown();
});
