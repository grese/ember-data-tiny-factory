/* jshint expr:true */
import Em from 'ember';
import { expect } from 'chai';
import { beforeEach } from 'mocha';
import { describeModule, it } from 'ember-mocha';
import ModelFactory from 'ember-data-tiny-factory';
import Post from 'dummy/models/post';
import Comment from 'dummy/models/comment';

describeModule('controller:test-controller', 'TestControllerController', {}, function() {

    var thePost;
    beforeEach(function(){
        // Creating 'index' post, and comments...
        var theComments = ModelFactory.createRecordList('comment', 5);
        thePost = ModelFactory.createRecord('post');
        console.log('published before: ', thePost.get('isPublished'));
        thePost.publish();
        console.log('published after: ', thePost.get('isPublished'));
        thePost.get('comments').pushObjects(theComments);
    });

    it('should be able to create models from a controller-test\'s "beforeEach" loop.', function() {
        this.subject();
        expect(thePost).to.be.an.instanceof(Post);
        expect(thePost.get('comments.length')).to.eq(5);
        var theComments = thePost.get('comments');
        theComments.forEach(function(comment){
            expect(comment).to.be.an.instanceof(Comment);
        });
    });

    it('should be able to create a model with custom attributes by passing an object for second argument to createRecord', function(){
        this.subject();
        var id = '999',
            title = 'A Custom Post',
            date = 1435934204;
        var customPost = ModelFactory.createRecord('post', {
            id: id,
            title: title,
            date: date,
            published: true,
            metadata: {
                hasPhoto: true
            }
        });
        expect(customPost).to.be.an.instanceof(Post);
        expect(customPost.get('id')).to.eq(id);
        expect(customPost.get('title')).to.eq(title);
        expect(customPost.get('date')).to.eq(date);
        expect(customPost.get('published')).to.eq(true);
        expect(customPost.get('metadata.hasPhoto')).to.eq(true);
    });

    it('should be able to create a list of models with mixed custom/non-custom attributes by passing an array as ' +
        'second argument to createRecordList.', function(){
        this.subject();

        var customParams = [
            {id: '50', title: 'A Custom Post', date: 109083421230, published: true}, // custom record with object...
            'special', // create post by template key...
            'index', // create post with 'index' key...
            'non-existent' // create a 'index' post with a key that doesn't exist...
            // 5th array item is undefined... should create a 'index' post instead.
        ];

        var customPosts = ModelFactory.createRecordList('post', 5, customParams);
        // Post created with custom object...
        var p0 = customPosts.objectAt(0);
        expect(p0).to.be.an.instanceof(Post);
        expect(p0.get('id')).to.eq('50');
        expect(p0.get('title')).to.eq('A Custom Post');
        expect(p0.get('date')).to.eq(109083421230);
        expect(p0.get('published')).to.eq(true);

        // Post created with 'special' template key...
        var p1 = customPosts.objectAt(1);
        expect(p1).to.be.an.instanceof(Post);
        expect(p1.get('title')).to.eq('This is a very special post');
        expect(p1.get('date')).to.eq(42345);
        expect(p1.get('published')).to.eq(true);
        expect(p1.get('metadata.hasPhoto')).to.eq(true);

        // Post created with 'index' template key...
        var p2 = customPosts.objectAt(2);
        expect(p2).to.be.an.instanceof(Post);
        expect(p2.get('title')).to.eq('This is the index post');
        expect(p2.get('date')).to.eq(13423);
        expect(p2.get('published')).to.eq(false);
        expect(p2.get('metadata.hasPhoto')).to.eq(false);

        // Post created with a non-existent template key...
        var p3 = customPosts.objectAt(3);
        expect(p3).to.be.an.instanceof(Post);
        expect(p3.get('title')).to.eq(undefined);
        expect(p3.get('date')).to.eq(undefined);
        expect(p3.get('published')).to.eq(undefined);
        expect(p3.get('metadata.hasPhoto')).to.eq(undefined);

        // Post created with an undefined template key...
        var p4 = customPosts.objectAt(4);
        expect(p4).to.be.an.instanceof(Post);
        expect(p4.get('title')).to.eq('This is the index post');
        expect(p4.get('date')).to.eq(13423);
        expect(p4.get('published')).to.eq(false);
        expect(p4.get('metadata.hasPhoto')).to.eq(false);
    });

    it('should be able to add a customId to a model based on a template by defining a customId in the third argument', function(){
        this.subject();
        var post = ModelFactory.createRecord('post', 'index', 'CUSTOM-ID');
        expect(post).to.be.an.instanceof(Post);
        expect(post.get('id')).to.eq('CUSTOM-ID');
        expect(post.get('title')).to.eq('This is the index post');
        expect(post.get('date')).to.eq(13423);
        expect(post.get('published')).to.eq(false);
        expect(post.get('metadata.hasPhoto')).to.eq(false);
    });
});
