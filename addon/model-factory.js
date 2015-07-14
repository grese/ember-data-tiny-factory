/* global require, requirejs */
import Em from 'ember';
import DS from 'ember-data';
import { getContext } from 'ember-test-helpers';

var modelFactory;

var ModelFactory = Em.Object.extend({
    numCreated: 0,
    ctx: null,
    store: null,
    resolver: null,
    modulePrefix: '',
    init: function(){
        this.setup();
    },
    setup: function(){
        this._initCtx();
        this._initStore();
        if(this.get('_isSetup')){
            this._registerModelsAndTransforms();
        }
    },
    teardown: function(){
        var factory = this;
        Em.run(function(){
            factory.clearStore();
            factory.set('store', null);
            factory.set('ctx', null);
            factory.set('_modules', {});
        });
    },
    defineTemplateMap: function(factoryName, templates){
        this.set('_templates.' + factoryName, templates);
    },
    createRecord: function(modelName, typeParam, customRecordId){
        typeParam = typeParam || 'index';
        var factory = this,
            store = this.get('store'),
            record = null,
            modelTemplate, recordTemplate;
        if(typeof typeParam === 'string'){
            // If typeParam is a string, try to look up the template.
            modelTemplate = this._lookupTemplate(modelName, typeParam);
        }else{
            // if typeParam is not a string, assume it is a custom object and create model.
            modelTemplate = typeParam;
        }

        // copy the template so we do not modify the original...
        recordTemplate = Em.$.extend({}, modelTemplate);
        if(customRecordId !== undefined){
            recordTemplate.id = customRecordId;
        }else{
            if(recordTemplate.id === undefined){
                recordTemplate.id = this._makeRecordId(modelName);
            }
        }
        Em.run(function(){
            record = store.push(modelName, recordTemplate);
            factory._overrideModelMethods(record);
        });
        return record;
    },
    _overrideModelMethods: function(record){
        // This method overrides Ember Data methods that will cause errors with mocked records...
        record.save = function(){ return record; };
    },
    createRecordList: function(modelName, count, typeParams, customIds){
        typeParams = typeParams || 'index';
        customIds = customIds || [];
        var i = 0, records = Em.A();
        if(typeof typeParams === 'string'){
            // If typeParams is a string, just create a list of records with same template...
            for(i = 0; i < count; i++){
                records.addObject(this.createRecord(modelName, typeParams));
            }
        }else{
            // If typeParams is NOT a string, assume it is an array and create each record with specified type...
            for(i = 0; i < count; i++){
                records.addObject(this.createRecord(modelName, typeParams[i], customIds[i]));
            }
        }
        return records;
    },
    clearStore: function(){
        var store = this.get('store'),
            typeKey;
        if(store){
            // Loop through model types in store, reset dirty states, and unload records for each type.
            for(typeKey in store.typeMaps){
                if(store.typeMaps.hasOwnProperty(typeKey)){
                    // unload records by type...
                    store.unloadAll(store.typeMaps[typeKey].type.modelName);
                }
            }
        }
    },
    _lookupTemplate: function(modelName, templateKey){
        templateKey = templateKey || 'index';
        return this.get('_templates.' + modelName + '.' + templateKey) || {};
    },
    _templates: {},
    _modules: {},
    _initCtx: function(){
        // Set 'ctx' to context of current test...
        this.set('ctx', getContext());
    },
    _initStore: function(){
        // Set 'store' to the DS.Store from the application container for the test.
        var ctx = this.get('ctx') || {},
            container = ctx.container,
            store = null;
        if(container){
            store = container.lookup('service:store');
            Em.assert('Model Factory requires an actual DS.Store to initialize.  ' +
                'Is the store injected into the unit that you are testing?', store instanceof DS.Store);
            this.set('store', store);
        }
    },
    _registerFactory: function(factoryName){
        // Requires the factory if it does not already exist so it calls define(factoryName)...
        if(!this.get('_templates.' + factoryName)){
            try{
                require(this.get('modulePrefix') + '/tests/factories/' + factoryName);
            }catch(e){
                console.warn('Could not find factory for ' + factoryName);
            }
        }
    },
    _registerDependency: function(type, name){
        if(type === 'model'){
            this._registerFactory(name);
        }
        // Registers a dependency for the test (DS.Transform or DS.Model)...
        var moduleName = type + ':' + name,
            resolver = this.get('resolver'),
            normalizedModuleName = resolver.normalize(moduleName),
            ctx = this.get('ctx'),
            module = resolver.resolve(normalizedModuleName),
            registry = ctx.registry || ctx.container;
        if(!registry.registrations[normalizedModuleName]){
            registry.register(moduleName, module);
        }
        return module;
    },
    _registerModelsAndTransforms: function(){
        var entries = requirejs.entries,
            modelPrefix = this.get('modulePrefix') + '/models/',
            transformPrefix = this.get('modulePrefix') + '/transforms/',
            entry;
        for(entry in entries){
            if(entries.hasOwnProperty(entry)){
                if(entry.indexOf(modelPrefix) > -1){
                    this._registerDependency('model', entry.replace(modelPrefix, ''));
                }else if(entry.indexOf(transformPrefix) > -1){
                    this._registerDependency('transform', entry.replace(transformPrefix, ''));
                }
            }
        }
    },
    _makeRecordId: function(modelName){
        this.incrementProperty('numCreated');
        return modelName + this.get('numCreated') + '-' + Date.now();
    },
    _isSetup: Em.computed('ctx', 'store', function(){
        return this.get('ctx') && this.get('store');
    })
});

modelFactory = ModelFactory.create();

export default {
    setResolver: function(resolver){
        modelFactory.set('resolver', resolver);
    },
    setModulePrefix: function(prefix){
        modelFactory.set('modulePrefix', prefix);
    },
    setup: function(){
        if(!modelFactory.get('_isSetup')){
            modelFactory.setup();
        }
    },
    teardown: function(){
        modelFactory.teardown();
    },
    define: function(modelName, templateMap){
        templateMap = templateMap || {};
        modelFactory.defineTemplateMap(modelName, templateMap);
    },

    // context & store are unavailable during very first test, due to the the global 'beforeEach' loop is run prior to
    // the app being setup.  To get around this, calling setup once more when createRecord is called to make sure
    // that the model factory is completely setup.
    createRecord: function(modelName, typeParam, customId){
        this.setup();
        return modelFactory.createRecord(modelName, typeParam, customId);
    },
    createRecordList: function(modelName, count, typeParams, customIds){
        this.setup();
        return modelFactory.createRecordList(modelName, count, typeParams, customIds);
    }
};
