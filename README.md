Installation
------------

  In order to set up the developer portal to run locally for testing purposes, follow the steps below:

    git clone git@github.com:buglabs/bugswarm-developers.git
    cd bugswarm-developers
    git submodule init
    git submodule update
    npm install

Contributing
------------

  If you wish to contribute, review the [fork+pull model][fork_pull_model] documentation and the [language and grammar guideline][wiki].
  The basic workflow is as follows:

  1. [Fork][forking] bugswarm-developers
  2. Create a topic branch - `git checkout -b my_branch`
  3. Test your changes - `npm test`
  4. Push to your branch - `git push origin my_branch`
  5. Create an [Issue][issues] with a link to your branch

Merging
-------

  For those with commit access, review [Managing Pull Requests][pull_requests] to understand how to merge a pull request.
  If the reviewed pull request looks good, run `npm test; npm run-script doc` to automagically renerate gh-pages before a `git push`.

[wiki]: https://github.com/buglabs/bugswarm-developers/wiki
[forking]: http://help.github.com/forking/
[issues]: http://github.com/buglabs/bugswarm-developers/issues
[pull_requests]: http://help.github.com/send-pull-requests/#managing_pull_requests
[fork_pull_model]: http://help.github.com/send-pull-requests/
