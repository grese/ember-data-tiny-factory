/* jshint expr:true */
import { expect } from 'chai';
import { describeModule, it } from 'ember-mocha';
import ModelFactory from 'ember-data-tiny-model-factory';

describeModule('route:test-route', 'TestRouteRoute', {}, function() {

    it('exists', function() {
        var controller = this.subject();
        expect(controller).to.be.ok;
    });
});
