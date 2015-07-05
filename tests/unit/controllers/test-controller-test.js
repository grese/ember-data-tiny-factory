/* jshint expr:true */
import Em from 'ember';
import { expect } from 'chai';
import { beforeEach } from 'mocha';
import { describeModule, it } from 'ember-mocha';
import ModelFactory from 'ember-data-tiny-factory';
import Post from 'dummy/models/post';
import Comment from 'dummy/models/comment';

describeModule('controller:test-controller', 'TestControllerController', {
    needs: ['model:post', 'model:comment']
}, function() {

    var thePost, theComments;
    beforeEach(function(){
        theComments = ModelFactory.createRecordList('comment', 5, [
            {id: 1, comment: 'enlightening!', date: 1435934204},
            {id: 2, comment: 'mystifying!', date: 1435934224}
        ]);
        thePost = ModelFactory.createRecord('post', {
            id: 1,
            title: 'Check it out!',
            date: 1435934204
        });
        thePost.get('comments').pushObjects(theComments);
    });

    it('should be able to create a DS.Model from within beforeEach hook of a controller test.', function() {
        this.subject();
        expect(thePost).to.be.an.instanceof(Post);
        theComments.forEach(function(comment){
            expect(comment).to.be.an.instanceof(Comment);
        });
    });

    it('should be able to create a DS.Model from within each test.', function() {
        this.subject();
        var aListOfComments = ModelFactory.createRecordList('comment', 2, [
            {id: 1, comment: 'well, hello there!', date: 1435934214},
            {id: 2, comment: 'fancy seeing you here?!', date: 1435934224}
        ]);
        var aPost = ModelFactory.createRecord('post', {
            id: 2,
            title: 'I am a special post',
            date: 1435934204
        });
        aPost.get('comments').pushObjects(aListOfComments);

        expect(aPost).to.be.an.instanceof(Post);
        var comments = aPost.get('comments');
        comments.forEach(function(comment){
            expect(comment).to.be.an.instanceof(Comment);
        });
    });
});
