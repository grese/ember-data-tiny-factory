import DS from 'ember-data';
import Em from 'ember';

var Post = DS.Model.extend({
    title: DS.attr('string'),
    comments: DS.hasMany('comment'),
    date: DS.attr('number'),
    published: DS.attr('boolean'),
    metadata: DS.attr('object')
});

Post.reopen({
    publish: function(){
        this.set('published', true);
    },
    isPublished: Em.computed('published', function(){
        return !!this.get('published');
    })
});

export default Post;
