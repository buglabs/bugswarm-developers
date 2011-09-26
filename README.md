Installation
------------

  In order to set up the developer portal to run locally for testing purposes, follow the steps below.

    git clone git@github.com:buglabs/bugswarm-developers.git
    cd bugswarm-developers
    git submodule init
    git submodule update
    npm install

Contributing
------------

  **Note:** When contributing, please reference the [wiki](https://github.com/buglabs/bugswarm-developers/wiki)
  and make an effort to use consistent language and grammar. Thank you!

  1. [Fork][0] hub
  2. Create a topic branch - `git checkout -b my_branch`
  3. Test your changes with `npm test`
  4. Push to your branch - `git push origin my_branch`
  5. Create an [Issue][1] with a link to your branch

Merging
-------

  If you have push access, please run `npm test` first
  For convinience, there is `npm run-script doc` for automagically regenerating gh-pages

[0]: http://help.github.com/forking/
[1]: http://github.com/buglabs/bugswarm-developers/issues
