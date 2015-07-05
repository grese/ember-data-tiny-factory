/* jshint expr:true */
import { expect } from 'chai';
import { describeModel, it } from 'ember-mocha';

describeModel('post', 'PostModel', {
    needs: 'model:comment'
}, function() {
    it('exists', function() {
        var controller = this.subject();
        expect(controller).to.be.ok;
    });
});
