/*globals blanket, module */
var isPhantom = (typeof exports !== 'undefined'),
    coverageDir = './',
    coverageFile = 'lcov.info',
    outputFile = coverageDir + coverageFile;

if(isPhantom && process.env.COVERAGE_DIR){
    outputFile = process.env.COVERAGE_DIR + '/' + coverageFile;
}
var options = {
    modulePrefix: "ember-data-tiny-factory",
    filter: "//.*ember-data-tiny-factory/.*/",
    antifilter: "//.*(tests|template).*/",
    loaderExclusions: ['ember-data-tiny-factory/setup/qunit'],
    enableCoverage: true,
    cliOptions: {
        reporters: ['lcov'],
        autostart: true,
        lcovOptions: {
            outputFile: outputFile
        }
    }
};
if(isPhantom){
    module.exports = options;
}else{
    blanket.options(options);
}
