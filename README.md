This project is based on angular-seed

# Drupal 8 Rest AngularJS

This project tries to reimplement the Bartik theme from Drupal 8 as an AngularJS webapplication communicating with Drupal through ReST

## Getting Started

All dependencies are managed with npm and bower. To start clone this repository and run:

```bash
$ npm install
$ npm start
  ^C
```

Drupal 8 ReST doesn't support [CORS][cors] yet so the app directory should be hosted on the same hostname and port as the Drupal 8 instance running the ReST api. The easiest way is to copy or symlink the `app` directory from this repo to to root of your Drupal 8 installation.

```bash
# Go to your Drupal 8 root directory
$ cd /var/www/drupal
$ ln -s /path/to/drupal-8-rest-angularjs/app .
```

[cors]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS

## Drupal configuration

### Modules

Install and enable https://www.drupal.org/project/restui

### Views need rest displays

Add a "Rest export" display to view
- http://drupal.d8/admin/structure/views/view/frontpage set path to '/node'
- http://drupal.d8/admin/structure/views/view/taxonomy_term/ set path to '/taxonomy/term/%'

### Add a taxonomy list view

Add a new view with "Rest export" display
- set path to '/taxonomy/list/%'
- filter on argument

### Rest UI

Check the configuration on http://drupal.d8/admin/config/services/rest

### Permissions

Check the permissions on http://drupal.d8/admin/people/permissions for 'RESTful Web Services' permissions.
