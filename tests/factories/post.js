import ModelFactory from 'ember-data-tiny-factory';

ModelFactory.define('post', {
    default: {
        id: 0,
        title: 'This is the default post',
        date: 13423,
        published: false,
        metadata: {
            hasPhoto: false
        }
    },
    special: {
        id: 1,
        title: 'This is a very special post',
        date: 42345,
        published: true,
        metadata: {
            hasPhoto: true
        }
    }
});
