
import Em from 'ember';
import DS from 'ember-data';
import { getContext } from 'ember-test-helpers';

var modelFactory,
    nativeTypes = Em.A(['string', 'boolean', 'number']);

var ModelFactory = Em.Object.extend({
    ctx: null,
    store: null,
    resolver: null,
    init: function(){
        this.setup();
    },
    setup: function(){
        this._initCtx();
        this._initStore();
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
    createRecord: function(modelName, params){
        params = params || {};
        var factory = this,
            store = this.get('store'),
            record = null;
        if(store){
            // Registers the model on the application container, and then creates the record...
            factory._registerModel(modelName);
            Em.run(function(){
                record = store.createRecord(modelName, params);
            });
        }
        return record;
    },
    createRecords: function(modelName, paramsList){
        paramsList = paramsList || [];
        var i, records = Em.A([]);
        for(i = 0; i < paramsList.length; i++){
            records.addObject(this.createRecord(modelName, paramsList[i]));
        }
        return records;
    },
    clearStore: function(){
        var store = this.get('store'),
            typeKey;
        if(store){
            // Loop through model types in store, and unload records for each type.
            for(typeKey in store.typeMaps){
                if(store.typeMaps.hasOwnProperty(typeKey)){
                    store.unloadAll(store.typeMaps[typeKey].type.modelName);
                }
            }
        }
    },
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
    _registerDependency: function(type, name){

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
    _registerModel: function(modelName){
        // *** "model:modelName" of the parent model must already be specified on the 'needs' relationship for the test.
        var factory = this,
            store = this.get('store'),
            modelCacheKey = '_modules.model:' + modelName,
            modelClass;

        // If model class is not cached, register it...
        if(!this.get(modelCacheKey)){
            // Register the actual model...
            factory._registerDependency('model', modelName);
            modelClass = store.modelFor(modelName);

            // Loop through each relationship of the provided model class (belongsTo, hasMany), register the dependent
            // model class, and if the sub-model was found, call _registerModel recursively to register sub-models...
            modelClass.eachRelationship(function(attrName, descriptor){
                var moduleName = (descriptor.type.modelName || descriptor.type.typeKey),
                    cacheKey = '_modules.' + moduleName,
                    module;
                if(!factory.get(cacheKey)){
                    module = factory._registerDependency('model', moduleName);
                    factory._registerModel(moduleName);
                    factory.set(cacheKey, module);
                }
            });

            // Loop through each transformed attribute of the model class, and register the transform if the data type
            // is not one of ember-data's native data types.
            modelClass.eachTransformedAttribute(function(attrName, type){
                var cacheKey = '_modules.transform:' + type,
                    module;
                if(!nativeTypes.contains(type) && !factory.get(cacheKey)){
                    module = factory._registerDependency('transform', type);
                    factory.set(cacheKey, module);
                }
            });

            // Cache the registered model class...
            this.set(modelCacheKey, modelClass);
        }
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
    setup: function(){
        if(!modelFactory.get('_isSetup')){
            modelFactory.setup();
        }
    },
    teardown: function(){
        modelFactory.teardown();
    },
    // context & store are unavailable during very first test, because the global 'beforeEach' loop is run prior to
    // the app being setup.  To get around this, calling setup once more when createRecord is called to make sure
    // that the model factory is completely setup.
    createRecord: function(modelName, params){
        this.setup();
        return modelFactory.createRecord(modelName, params);
    },
    createRecords: function(modelName, paramsList){
        this.setup();
        return modelFactory.createRecords(modelName, paramsList);
    }
};
