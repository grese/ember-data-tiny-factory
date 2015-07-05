import resolver from './helpers/resolver';
import { setResolver } from 'ember-mocha';
import { beforeEach, afterEach } from 'mocha';
import ModelFactory from 'ember-data-tiny-factory';

setResolver(resolver);
ModelFactory.configure('ember-data-tiny-factory');
ModelFactory.setResolver(resolver);
beforeEach(function(){
    ModelFactory.setup();
});
afterEach(function(){
    ModelFactory.teardown();
});
