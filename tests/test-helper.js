import resolver from './helpers/resolver';
import { setResolver } from 'ember-mocha';
import { beforeEach, afterEach } from 'mocha';
import ModelFactory from 'ember-data-tiny-model-factory';

setResolver(resolver);

ModelFactory.setResolver(resolver);
beforeEach(function(){
    ModelFactory.setup();
});

afterEach(function(){
    ModelFactory.teardown();
});
