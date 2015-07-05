import ModelFactory from 'ember-data-tiny-factory';

ModelFactory.define('comment', {
    default: {
        id: 0,
        comment: 'This is the default comment',
        date: 12345,
        metadata: {
            approved: false
        }
    },
    special: {
        id: 1,
        comment: 'This is the very special comment',
        date: 23456,
        metadata: {
            approved: true
        }
    }
});
