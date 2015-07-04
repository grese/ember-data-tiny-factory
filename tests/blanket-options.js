/*globals blanket, module */
var isPhantom = (typeof exports !== 'undefined'),
    coverageDir = './',
    coverageFile = 'lcov.info',
    outputFile = coverageDir + coverageFile;

if(isPhantom && process.env.COVERAGE_DIR){
    outputFile = process.env.COVERAGE_DIR + '/' + coverageFile;
}
var options = {
    modulePrefix: "ember-data-tiny-model-factory",
    filter: "//.*ember-data-tiny-model-factory/.*/",
    antifilter: "//.*(tests|template).*/",
    loaderExclusions: [],
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
