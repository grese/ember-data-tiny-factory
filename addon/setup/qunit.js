import ModelFactory from 'ember-data-tiny-factory';
import QUnit from 'qunit';

QUnit.testStart(function(){
    ModelFactory.setup();
});
QUnit.testDone(function(){
    ModelFactory.teardown();
});

export function factorySetup(options){
    ModelFactory.setResolver(options.resolver);
    ModelFactory.setModulePrefix(options.modulePrefix);
}
