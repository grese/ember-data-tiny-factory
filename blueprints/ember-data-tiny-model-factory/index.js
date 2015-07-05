/* globals module */
var EOL = require('os').EOL;

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
        var locals = this.locals(options),
            framework = locals.testFramework,
            moduleImportsJS = "import ModelFactory from 'ember-data-tiny-factory';" + EOL,
            setupTeardownJS =
                "ModelFactory.configure('" + locals.appModulePrefix + "');" + EOL +
                "ModelFactory.setResolver(resolver);" + EOL,
            resolverSet = 'setResolver(resolver);' + EOL,
            resolverImport = "import resolver from './helpers/resolver';'" + EOL;

        if(framework === 'mocha'){
            moduleImportsJS += "import { beforeEach, afterEach } from 'mocha';" + EOL;
            setupTeardownJS +=
                "beforeEach(function(){" + EOL +
                "    ModelFactory.setup();" + EOL +
                "});" + EOL +
                "afterEach(function(){" + EOL +
                "    ModelFactory.teardown();" + EOL +
                "});" + EOL;
        }else if(framework === 'qunit'){
            moduleImportsJS += "import QUnit from 'qunit';" + EOL;
            setupTeardownJS +=
                "QUnit.testStart(function(){" + EOL +
                "    ModelFactory.setup();" + EOL +
                "});" + EOL +
                "QUnit.testDone(function(){" + EOL +
                "    ModelFactory.teardown();" + EOL +
                "});" + EOL;
        }
        console.log('Writing setup and teardown hooks to tests/test-helper.js');
        return this.insertIntoFile("tests/test-helper.js",
                moduleImportsJS,
                { before: resolverImport }).then(function(){
                return this.insertIntoFile("tests/test-helper.js",
                    setupTeardownJS,
                    { after: resolverSet });
            }.bind(this));
    }
};
