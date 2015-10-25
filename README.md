# Drupal 8 Rest AngularJS

This project tries to reimplement the Bartik theme from Drupal 8 as an AngularJS webapplication communicating with Drupal through ReST

## Getting Started

This project setup is done by [angular-seed][angular-seed]

All dependencies are managed with npm and bower. To start clone this repository and run:

```bash
$ npm install
$ npm start
  ...
  ^C
```

## Default installation

Drupal 8 ReST doesn't support [CORS][cors] yet so the app directory should be
hosted on the same hostname and port as the Drupal 8 instance running
the ReST api. The easiest way is to copy or symlink the `app` directory from
this repo to to root of your Drupal 8 installation.

BASIC AUTH is currently broken on [authenticated users](https://www.drupal.org/node/2504433) and [views REST export](https://www.drupal.org/node/2228141) so we use COOKIE based.

```bash
# Go to your Drupal 8 root directory
$ cd /var/www/drupal
$ ln -s /path/to/drupal-8-rest-angularjs/app .
```

### config.js

You must copy `config.js.dist` to `app/config.js` and change it's values.

### Installing on a CORS configured server

When having configured your web server of the .htaccess with core you should
change the app.js config section.

## Drupal configuration

Current version only supports __hal+json__ so make sure all views and rest
resources support these.

## Modules

Install and enable [Rest UI][restui] module. With that module you can expose nodes, comments and users to Rest clients.

## Add rest export displays

Add a "Rest export" display to the following views:

- http://drupal.d8/admin/structure/views/view/frontpage set path to '/node'
- http://drupal.d8/admin/structure/views/view/taxonomy_term/ set path to '/taxonomy/term/%'

## Import views

You need to import the views from `/app/_drupal` directory.

### /taxonomy/list

This view adds a "Rest export" display with path to '/taxonomy/list' to display the term name.

### /node/%/comments

This view adds a "Rest export" display with path to '/node/%/comments' to display the comments.

## Rest UI

Check the configuration on http://drupal.d8/admin/config/services/rest

## Permissions

Check the permissions on http://drupal.d8/admin/people/permissions for 'RESTful Web Services' permissions.

[cors]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS
[angular-seed]: https://github.com/angular/angular-seed
[restui]: https://www.drupal.org/project/restui
