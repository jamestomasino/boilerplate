# Boilerplate

## Overview ##

The boilerplate is a sample project to build MVC javascript websites, either in
single or multipage formats with the least overhead possible. By the use of
extremely small micro-libraries, basic javascript functions and structures can
remain the style and structure of the website.

- - - - -

## Hooks ##

Instead of relying on each member of your team to add and update their
`.git/hooks/` files individually, the hooks are instead kept in the repo
itself.

This means that you can add as many hooks directly into your repo as you like,
and you can also add custom local hooks that can be individually ignored as
well.

To set up the hooks in your local repository, run the following executable:

```bash
$ hooks/hooks-installer
```

Any hook defined in the hooks/ folder will then act as if it were in
`.git/hooks/`. A pre-commit hook has been included by default. Upon any commit,
the `pre-commit` hook will auto generate a `TODO.md` file and append its
contents at the end of this file. The contents of the list is generated by
searching all javascript code for instances of `//TODO:`.

- - - - -

## JavaScript ##

javascript

### Micro-Libraries ###

#### NS.js ####

`NS.js` (Namespace) manages the loading and access of dependencies across the
application.

##### NS.load #####

To use another class or library, use the `NS.load` method. If the external 
resource hasn't already been loaded, NS will make the necessary ajax request 
to load the resource and any dependencies. When complete, it will fire the 
callback function. 

```javascript
NS.load (['lib.to.Load', 'another.lib.Loading'], callback, scope);
```

_This method was added as a result of xHR synchronous loading [being
deprecated](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Synchronous_and_Asynchronous_Requests#Synchronous_request)
in the latest JS spec._ 

##### NS.use #####

To use another class or library into the current context, use the
`NS.use` method. You can directly reference the lib by its full dot-path at
any time. This method is provided as a convenience.

```javascript
var LocalCopyOfLib = NS.use ("path.to.class.or.lib");
```

##### NS.baseURL #####

Setting the `NS.baseURL` property will allow you to change the root path of
your external javascript libraries. By default the path is `/`. Be sure to
include a trailing slash.

```javascript
NS.baseURL = 'js/';
```

##### NS.createXMLHTTPObject #####

As the NS class is responsible for loading external resources, it is also
capable of creating a browser-appropriate XMLHttpRequest or ActiveX object.
This method calls a factory pattern returning the appropriate object and has
been made externally available as a convenience method.

```javascript
var httprequest = NS.createXMLHTTPObject();
```

#### Ajax.js ####

`Ajax.js` is a convenience wrapper for the loading of all ajax requests. It
contains only a single constructor method.

##### new Ajax() #####

The Ajax class takes 3 or 4 parameters: url, callback, error, [post data].

```javascript
var getExample = new Ajax ( url, callbackFunction, errorFunction );
var postExample = new Ajax ( url, callbackFunction, errorFunction, postData );
```

If a readyState of 4 and request status of 200 are received, your callback
function will be executed. Otherwise the error function will be called.

_Note: calling Ajax without the new keyword will throw errors._

#### Events.js ####

`Events.js` is a simple subscriber that allows for a basic global messaging
system. The main methods are subscribe, unsubscribe, and trigger. There are
also various logging functions for debugging purposes. This Events class allows
for the observer pattern which in turn supports the MVC structure of the
boilerplate.

##### Events.subscribe #####

The `subscribe` method supports 3 parameters: eventName, callback, [priority].

```javascript
Events.subscribe('EVENT_NAME', callbackFunc, 10);
```

By default, events are not proxied to preserve scope. You will likely want to
use `Delegate` when using this within a class.

##### Events.unsubscribe #####

The opposite of the subscribe method, this will unbind your event listener.
Only the event name and callback are required. When unsubscribing an event with
a callback that was created using a Delegate, be sure to save the reference to
the proxied callback for unbinding.

```javascript
Events.unsubscribe('EVENT_NAME', callbackFunc);
```

##### Events.trigger #####

Triggering an event is simple with the `trigger` method. Three arguments are
supported: eventName, [data, context].

```javascript
Events.trigger('EVENT_NAME');
Events.trigger('EVENT_NAME', [arr, of, data]);
Events.trigger('EVENT_NAME', [arr, of, data], this);
```

The data property must be an array. If it isn't, it will be converted to an
array.

The context value will set the scope of `this` in the callback function. Please
note this could have strange consequences if you've proxied the callback
function.

#### Delegate.js ####

`Delegate.js` is a very simple wrapper that enables a global function called
`Delegate`, which proxies the context of `this` in a function. When using
class-based structures, it's useant to maintain class scope in event
listener callbacks, especially on the DOM.

```javascript
// create a delegate function maintaining scope
var c = Delegate(callbackFunc, this);

// examples of using that function
Event.subscribe ('SOME_EVENT', c);
Event.unsubscribe ('SOME_EVENT', c);
```

#### Bind.js ####

Bidirectional data binding is made available through the `Bind` class.
Instantiating an instance of this class requires a single id parameter. This ID
will connect to one or more `data-bind-*` properties in the DOM.

```javascript
var bindsample = new Bind('bindsample');
// Relates to elements with the attribute "data-bind-bindsample"
```

Any `change` events fired by that element will automatically update the data in
the Bind instance's attributes list. Likewise, any change to the Bind
instance's attributes will propgate to the DOM.

Setting or getting an instance's attributes is done via the `set` and `get`
methods.

```javascript
bindsample.set('propname', 'samplevalue');
```

The above example will update the value or innerHTML of any elements with the
appropriate attribute, like the following example:

```html
	<div data-bind-bindsample="propname"></div>
```

Properties values are updated or inserted into these DOM elements via
innerHTML, or value if they are input, textarea, or select types.

### App ###

The design of the application logic follows the MVC pattern by way of Observer
patterns. A subscriber system allows for global binding and triggering of
events to control application flow. In a multi-page application, the page
source (`js/page1.js` for example) will load the appropriate Models, Views, and
Controllers for the given page's content. Components can be reused or shared
between pages to minimize asset load at runtime and facilitate good OOP
principals.

_If you prefer to use a different presentation pattern than MVC, the libraries
available in this boilerplate should allow you to easily restructure the app to
your needs. I recommend reviewing the [excellent blog
post](https://manojjaggavarapu.wordpress.com/2012/05/02/presentation-patterns-mvc-mvp-pm-mvvm/)
by Manoj Jaggavarapu on the subject._

Like all library dependencies, each application component makes use of `NS.js`
to create a namespace for the class and to handle dependency loading.

#### Model ####

The model controls the business logic of you application. Business logic can be
a vague term when it come to apps that are primarily front-end. For years I was
tripped up by this and ended up with massive Views as a result. Take heed from
my mistake. If your app doesn't have business logic to speak of, consider this
a ViewModel. It's flexible and can do whatever you'd like.

In the `SampleModel.js` file, an example of a constructor, public method,
getter/setter, and internal methods are available. The class demonstrates a
very basic example of a state machine, via ApplicationMode, which may be
useful. Methods are commented with docstring-esque syntax, which may help
support some code [editors](http://www.vim.org) with better code inspection
support.

The sample model also gives an example of external data loading via an example
JSON file loaded via ajax.

#### View ####

The Views of your application are in charge of the DOM. They're created by
passing a reference to the part of the DOM they will control. They can then
create, replace, update, and delete the visible interface. They also handle any
bindable interactions (e.g., buttons, textfields, swipes).

When an interaction takes place in the View, it dispatches Events to inform the
rest of the application. The View affects no change in the application on its
own.

The View will listen to Global data events relevant to any data it is
displaying in order to update itself. Application state changes, list updating,
pagination, are all examples of Events that might be subscribed in the view.

You may also make use of the `Bind` class for bidirectional data binding. See
the section above for details.

By default there are no dependency libraries in this boilerplate for accessing
or manipulating the DOM. JQuery, in particular, is overly large and counter to
the philosophy of this tool.

#### Controller ####

Controllers listen for events from the views and control specific actions by
manipulating the Model. Your controllers will have a reference to one or more
Models in your application and will call public methods on those Models to make
changes.

In the `SampleController.js` file, the example is subscribed to a UI Event.
When that event fires, the controller calls a sampleMethod on the Model. In
rare cases, Controllers may also fire events of their own, listened to by other
controllers. Generally speaking your controller will listen for Events from the
Views and call direct methods on Models.

- - - - -

_Anything below this line will be overwritten upon commit._
## TODO ##

