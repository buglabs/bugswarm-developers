Installation
------------

  In order to set up the developer portal to run locally for testing purposes, follow the steps below.

    git clone git@github.com:buglabs/bugswarm-developers.git
    cd bugswarm-developers
    git submodule init
    git submodule update
    npm install

Contribution
------------

  In order to contribute to the developer portal, fork the repository, make your changes, and run `npm test` to view those changes.
  When you are satisfied, submit a pull request for the master branch only.
  After merging a pull request, run `npm doc` to regenerate the docs and push to gh-pages.

  **Note:** When contributing, please reference the [wiki](https://github.com/buglabs/bugswarm-developers/wiki)
  and make an effort to use consistent language and grammar. Thank you!
