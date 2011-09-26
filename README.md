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

  **Note:** When contributing, please reference the [wiki][0]
  and make an effort to use consistent language and grammar. Thank you!

  1. [Fork][1] bugswarm-developers
  2. Create a topic branch - `git checkout -b my_branch`
  3. Test your changes with `npm test`
  4. Push to your branch - `git push origin my_branch`
  5. Create an [Issue][2] with a link to your branch

Merging
-------
  Who does it: If you have push access then you allowed to respond to a pull request by merging the changes.

  What to do: Review the changes. If there is a problem, notify the user who requested the pull. If the changes are acceptable, merge the changes, review the merge in a browser, and push the changes to gh-pages.

  When to do it: Do this whenever you receive a pull request.

  How to do it: Run `npm test` and review the changes. When you are satisfied with the changes, run `npm run-script doc` to automagically regenerate gh-pages.

[0]: https://github.com/buglabs/bugswarm-developers/wiki
[1]: http://help.github.com/forking/
[2]: http://github.com/buglabs/bugswarm-developers/issues
