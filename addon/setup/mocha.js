import ModelFactory from 'ember-data-tiny-factory';
import { beforeEach, afterEach } from 'mocha';

beforeEach(function(){
    ModelFactory.setup();
});
afterEach(function(){
    ModelFactory.teardown();
});

export function factorySetup(options){
    ModelFactory.setResolver(options.resolver);
    ModelFactory.setModulePrefix(options.modulePrefix);
}
