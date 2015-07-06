import ModelFactory from 'ember-data-tiny-factory';

ModelFactory.define('post', {
    index: {
        title: 'This is the index post',
        date: 13423,
        published: false,
        metadata: {
            hasPhoto: false
        }
    },
    special: {
        title: 'This is a very special post',
        date: 42345,
        published: true,
        metadata: {
            hasPhoto: true
        }
    }
});
