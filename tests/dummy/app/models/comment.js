import DS from 'ember-data';
export default DS.Model.extend({
    comment: DS.attr('string'),
    date: DS.attr('number'),
    metadata: DS.attr('object')
});
