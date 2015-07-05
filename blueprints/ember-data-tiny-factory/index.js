/* globals module */
var EOL = require('os').EOL;

var buildConfigureJS = function(modulePrefix, framework){
    var MODULE_IMPORTS;
    if(framework === 'mocha'){
        MODULE_IMPORTS = "import { factorySetup } from 'ember-data-tiny-factory/setup/mocha";
    }else{
        MODULE_IMPORTS = "import { factorySetup } from 'ember-data-tiny-factory/setup/qunit";
    }
    var CONFIG_SCRIPTS =
        "factorySetup({" + EOL +
        "    modulePrefix: '" + modulePrefix + "'," + EOL +
        "    resolver: resolver" + EOL +
        "});";
    return {
        MODULE_IMPORTS: MODULE_IMPORTS,
        CONFIG_SCRIPTS: CONFIG_SCRIPTS
    };
};

module.exports = {
    description: 'A simple model factory to help with creating actual ember-data models for use in your unit tests.',
    locals: function(options){
        var framework = null;
        if(options.project.addonPackages['ember-cli-mocha']){
            framework = 'mocha';
        }else if(options.project.addonPackages['ember-cli-qunit']){
            framework = 'qunit';
        }
        return {
            testFramework: framework,
            appModulePrefix: options.project.pkg.name
        };
    },
    afterInstall: function(options){
        var blueprint = this,
            locals = blueprint.locals(options),
            helperJS = buildConfigureJS(locals.appModulePrefix, locals.testFramework),
            helperFilename = 'tests/test-helper.js',
            helperImportTarget = "import resolver from './helpers/resolver';" + EOL,
            helperConfigTarget = "setResolver(resolver);" + EOL;

        console.log('Writing ModelFactory setup script to tests/test-helper.js ...');

        return blueprint.insertIntoFile(helperFilename, helperJS.MODULE_IMPORTS, {after: helperImportTarget}).then(function(){
            return blueprint.insertIntoFile(helperFilename, helperJS.CONFIG_SCRIPTS, {after: helperConfigTarget});
        });
    }
};
