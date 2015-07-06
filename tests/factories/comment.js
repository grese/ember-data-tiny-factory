import ModelFactory from 'ember-data-tiny-factory';

ModelFactory.define('comment', {
    index: {
        comment: 'This is the index comment',
        date: 12345,
        metadata: {
            approved: false
        }
    },
    special: {
        comment: 'This is the very special comment',
        date: 23456,
        metadata: {
            approved: true
        }
    }
});
