/* jshint expr:true */
import { expect } from 'chai';
import { beforeEach } from 'mocha';
import { describeModule, it } from 'ember-mocha';
import ModelFactory from 'ember-data-tiny-model-factory';

describeModule('controller:test-controller', 'TestControllerController', {
    needs: ['model:post', 'model:comment']
}, function() {

    var thePost;
    beforeEach(function(){
        var theComments = ModelFactory.createRecords('comment', [
            {id: 1, comment: 'enlightening!', date: 1435934204},
            {id: 2, comment: 'mystifying!', date: 1435934224}
        ]);
        thePost = ModelFactory.createRecord('post', {
            id: 1,
            title: 'Check it out!',
            comments: theComments,
            date: 1435934204
        });

        console.log('POST: ', thePost);

    });

    it('should be able to create a DS.Model from within beforeEach hook of a controller test.', function() {
        this.subject();
    });

    it('should be able to create a DS.Model from within each test.', function() {
        this.subject();
        /*var aListOfComments = ModelFactory.createRecords('comment', [
            {id: 1, comment: 'well, hello there!', date: 1435934214},
            {id: 2, comment: 'fancy seeing you here?!', date: 1435934224}
        ]);
        var aPost = ModelFactory.createRecord('post', {
            id: 2,
            title: 'I am a special post',
            comments: aListOfComments,
            date: 1435934204
        });

        expect(aPost).to.be.an.instanceof(Post);
        var comments = aPost.get('comments');
        comments.forEach(function(comment){
            expect(comment).to.be.an.instanceof(Comment);
        });*/
    });
});
