# Ember Data Tiny Factory - (for EmberCLI)
This is an EmberCLI addon that allows you to create mock Ember Data models for use in your unit tests.
* Works with [Mocha](http://mochajs.org/) and [QUnit](https://qunitjs.com/).
* Automatic setup/teardown of ModelFactory before/after each test...
* Automatic lookup of transitive dependencies (DS.Transforms and DS.Model) in your models. (You do NOT need to add them in the 'needs' relationship for your tests).
* Supports both template based record creation, and ad-hoc definition of id or properties for a record.
* Allows generation of factory templates using `ember g factory [MODEL_NAME]`

## Installation
* Install the addon: `ember install git+ssh://git@github.com:grese/ember-data-tiny-factory.git`
* Run the generator: `ember g ember-data-tiny-factory ember-data-tiny-factory`
  * NOTE: (you actually need the second 'ember-data-tiny-factory')
* Look in your tests/test-helper.js file:
  * You should see that the following lines of code have been automaticaly added to the file (if QUnit, you will see `import { factorySetup } from 'ember-data-tiny-factory/setup/qunit';` as the import statement).
    ```javascript
    // ...
    import { factorySetup } from 'ember-data-tiny-factory/setup/mocha';
    // ...
    factorySetup({
        modulePrefix: '[YOUR_APP_NAME]',
        resolver: resolver
    });
    ```
  * If you do not see these lines, just add them (with the correct import statement for your test framework).

## Usage
#### Factories
You'll need to create a factory for any models that you want to mock using the ModelFactory.  The name of your factory
needs to map to the name of the model it represents.  For instance, a 'post' model would have a 'post' factory.
* Create a Factory named 'post':
  * `ember g factory post`
  * This will create a factory in *tests/factories/post.js*, which will have the following code:
  ```javascript
  import ModelFactory from 'ember-data-tiny-factory';

  ModelFactory.define('post', {
      index: {}
  });
  ```

* Defining 'templates' in the factory
  * Create 'templates' which you can use to build similar records over and over with specific values.
  * The 'index' template will be used by default if none specified.
  * It is recommended that you do NOT specify the 'id' property in your templates.
  * Technically, you CAN specify an id in your templates, but be mindful that you will not be able to create lists of records from that template if it has an 'id' hard-coded because each EmberData record must have a unique 'id'.
  * Some sample templates...
  ```javascript
  // in tests/factories/post.js ...
  ModelFactory.define('post', {
      index: {
          title: 'The index template will be used by default...',
          date: '2015-07-04'
      },
      noTitle: {
          title: null,
          date: '2015-07-04'
      },
      noDate: {
          title: 'I have no date...',
          date: null
      }
  });

  // in tests/factories/comment.js ...
  ModelFactory.define('post', {
      index: {
          comment: 'Well, that was SOME story!',
          date: '2015-07-04',
          isApproved: false
      },
      approved: {
          comment: 'Well, that was SOME story!',
          date: '2015-07-04',
          isApproved: false
      },
      empty: {
          comment: 'Well, that was SOME story!',
          date: '2015-07-04',
          isApproved: false
      }
  });
  ```

* Creating Records
  * Create record(s) from a template:
  ```javascript
  // ...
  import ModelFactory from 'ember-data-tiny-factory';
  // ...
  var post = ModelFactory.createRecord('post'); // Creates a 'post' with 'index' template
  var noDatePost = ModelFactory.createRecord('post', 'noDate'); // Creates a 'post' using 'noDate' template
  var noTitlePost = ModelFactory.createRecord('post', 'noTitle'); // Creates a 'post' using 'noTitle' template

  var comments = ModelFactory.createRecordList('comment', 3); // Creates a list of 3 'index' comments.
  // Creates a list of 10 'approved' comments.
  var approvedComments = ModelFactory.createRecordList('comment', 10, 'approved');
  // Creates a list of comments: one 'index', one 'approved', one 'empty'.
  var assortedComments = ModelFactory.createRecordList('comment', 2, ['index', 'approved', 'empty']);

  // NOTE: All of the records created in the examples above will have an automatically generated 'id'.
  // ...
  ```

  * Create record(s) from a template with a custom 'id'
  ```javascript
    // ...
    import ModelFactory from 'ember-data-tiny-factory';
    // ...
    // Create a 'post' with 'index' template, and 'id' of '12345'.
    var post = ModelFactory.createRecord('post', 'index', '12345');
    // Create a 'post' with 'index' template, and 'id' of '23456'.
    var post2 = ModelFactory.createRecord('post', null, '23456');
    // ...
  ```
  * Create ad-hoc record(s) with custom properties
  ```javascript
      // ...
      import ModelFactory from 'ember-data-tiny-factory';
      // ...
      // Create 4 'comment' records... Some from templates, and others with custom properties...
      var customComments = ModelFactory.createRecordList('comment', 3, [
          'index', // A comment from 'index' template...
          {id: '1', comment: 'splendid!'}, // Custom record...
          {comment: 'fantastic!'}, // Custom record with auto-generated id...
      ]);
      var customPost = ModelFactory.createRecord('post', {
          id: '10',
          title: 'I am a custom post',
          date: '2015-07-04'
      });
      customPost.set('comments', customComments);
      // ...
  ```

## Collaboration
#### Installation
* `git clone git@github.com:grese/ember-data-tiny-factory.git`
* `npm install`
* `bower install`
#### Running
* `ember server`
* Visit your app at http://localhost:4200.
#### Running Tests
* `ember test`
* `ember test --server`
#### Building
* `ember build`
For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
