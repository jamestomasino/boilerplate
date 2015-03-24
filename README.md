# Boilerplate

## Overview ##

The boilerplate is a sample project to build MVC javascript websites, either in
single or multipage formats with the least overhead possible. By the use of
extremely small micro-libraries, basic javascript functions and structures can
remain the style and structure of the website.

- - - - -
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents ##

- [Hooks](#hooks)
- [JavaScript](#javascript)
  - [Micro-Libraries](#micro-libraries)
    - [NS.js](#nsjs)
      - [NS.load](#nsload)
      - [NS.use](#nsuse)
      - [NS.baseURL](#nsbaseurl)
      - [NS.createXMLHTTPObject](#nscreatexmlhttpobject)
    - [Ajax.js](#ajaxjs)
      - [new Ajax()](#new-ajax)
    - [Events.js](#eventsjs)
      - [Events.subscribe](#eventssubscribe)
      - [Events.unsubscribe](#eventsunsubscribe)
      - [Events.trigger](#eventstrigger)
    - [Delegate.js](#delegatejs)
    - [Bind.js](#bindjs)
  - [App](#app)
    - [Model](#model)
    - [View](#view)
    - [Controller](#controller)
- [PHP](#php)
  - [Adaptive Images](#adaptive-images)
- [Server](#server)
  - [.htaccess](#htaccess)
  - [robots.txt](#robotstxt)
  - [sitemap.xml](#sitemapxml)
  - [humans.txt](#humanstxt)
  - [favicon.ico](#faviconico)
- [TODO](#todo)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
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

The overall objective of the javascript used in this boilerplate is to do away
with the need for 3rd party libraries like jQuery. Instead, small libraries are
created with as little dependency as possible. These can be chained together
and use one another by way of the NS (NameSpace) library. By eliminating jQuery
and other massive libraries, the focus can be back on writing pure, vanilla
javascript code. There is no other framework to learn or adapt to. In fact, the
MVC pattern used below in the App section can be completely removed and
replaced by a single page file if that better suits your needs. Everything here
is designed to be as modular as it can with the exception of `NS.js`, which
serves as the dependency loader.

### Micro-Libraries ###

#### NS.js ####

`NS.js` (Namespace) manages the loading and access of dependencies across the
application.

##### NS.load #####

To use another class or library, use the `NS.load` method. If the external
resource hasn't already been loaded, NS will make the necessary ajax request to
load the resource and any dependencies. When complete, it will fire the
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
#### DOM.js ####

`DOM.js` provides some basic cross-browser methods for retrieving and creating
DOM elements.

##### DOM.create() #####

Pass a string of HTML to this method to create the elements quickly by way of
createDocumentFragment. Don't forget to attach the result where you want it,
though.

```javascript
var el = DOM.create('<h1>hello world!</h1>');
document.body.appendChild(el);
```

##### DOM.find() #####

One of the most obnoxious limitations of working without jQuery is the
inability to quickly find elements in the DOM. This method helps sort that out.

```javascript
var elementByID = DOM.find('#someid');
var elementsByClass = DOM.find('.someclass');
var elementsByNode = DOM.find('li' );
var elementsByContext DOM.find('.someclass', elementForContext);
```

To best support older browsers, this method does not try to handle child
selectors or anything too fancy. It's faster just to make seperate queries and
use the result as the context of the next.

Also, IE8 does not support querySelectorAll. Certain queries may generate
a warning about this fact in the console.

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

#### Analytics.js ####

`Analytics.js` is a skeletal structure designed to wrap and centralize your
website analytics calls. By default it is configured to use Google Analytics.
In its present form it does little but wrap that functionality into a class
structure. 

This class shines best when you have other types of metrics being collected.
Combining these calls into a single class saves time and makes the code more
readable. 

The `Analytics.js` class automatically hijacks exit links and adds event tracking.

##### new Analytics() #####

Initialize your analytics class by passing it your Google Analytics ID.

```javascript
var analytics = new Analytics ( 'UA-971204-A' );
```

##### Analytics.trackEvent() #####

Track events in a convenient way that doesn't interfere with bounce rates or
timing.

```javascript
analytics.trackEvent( category, action, label, value );
```

Both the label and value parameters are optional.

##### Analytics.trackTime() #####

Timer events are easily fired off with this helper method.

```javascript
analytics.trackTime( category, variable, value, label );
```

Value and label are optional parameters.

#### Storage.js ####

`Storage.js` is a localstorage wrapper. It supports JSON processing of objects
being stored and retreived. This static class has a getter and setter property.

```javascript
var value = Storage.get('someid');
Storage.set('someid', someValue);
```

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


## PHP ##

This boilerplate is designed to use open source technologies, including PHP for
backend control. There is very standard backend as part of the core
boilerplate, but there are a few nice utilities.

### Adaptive Images ###

The [Adaptive Images](http://adaptive-images.com/) utility automatically sizes
your imagery to minimize bandwidth on smaller devices. By measuring the width
of the screen/client as the page loads, the backend script automatically
resizes your image to the appropriate breakpoint. These resized images are
saved in a cache folder to minimize processing load on the server, and are
automatically served to the client by way of Apache MOD_REWRITE directives in
the .htaccess file (see below). The GD lib is used (normally a default module
installed with PHP) to support the resizing.

To set up adaptive images, all you'll need to do is tweak the `$resolutions`
variable inside the `adaptive-images.php` file in the web root. Match these
resolutions to your CSS breakpoints and everything should just work. If you
encounter any issues, make sure that the `images-cache` folder (created
automatically) has forgiving write permissions in order to create the resized
images. Also, be sure that you are taking advantage of the included `.htaccess`
file. It is hidden by default in many operating systems and may be easily
overlooked by FTP clients.

_Some small customizations have been made to the adaptive-images code in both
PHP and javascript to improve performance._

- - - - -

## Server ##

### .htaccess ###

The included `.htaccess` file performs a number of desirable tasks, including
the following:

- Rewrites all directory URLs with trailing /'s (for SEO)
- Supports Adaptive Images (see above)
- GZip compresses many common MIME-types
- Sets Access-Control-Allow-Origin directives
- Defines caching durations and access by type
- Adds Cache-Control headers

### robots.txt ###

The `robots.txt` file gives instruction to search engines crawling the site as
to which content is appropriate to show in search results. By default a number
of basic directories are excluded, most notably the images folder.

Finally a reference is made to the sitemap file, used most commonly as
instructions to bots on not only what to spider, but how often to check back.

### sitemap.xml ###

An example sitemap file is included here illustrating how to list the pages of
your site, rank them via priority, and set their frequency of change. It is
much easier to use a [sitemap
generator](https://code.google.com/p/sitemap-generators/wiki/SitemapGenerators)
than update this by hand.

### humans.txt ###

In the style of `robots.txt`, the `[humans.txt](http://humanstxt.org/)` file
provides information to... humans! There is very little to the [standard
formatting](http://humanstxt.org/Standard.html) for this file, but it should be
straight forward and easy to understand for any human that stumbles upon it.
The format in this project losely follows that of
[HTML5Boilerplate](https://html5boilerplate.com/humans.txt).

### favicon.ico ###

A sample `favicon.ico` file has been included mainly so that it's not
forgotten. Hopefully a big black box will serve as a nice reminder to put
something meaningful together.

- - - - -

_Anything below this line will be overwritten upon commit. See the section on
Hooks, above, for more details._
## TODO ##

