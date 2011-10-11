Installation
------------

  To install the developer portal locally:

    git clone git@github.com:buglabs/bugswarm-developers.git && cd bugswarm-developers
    git submodule init && git submodule update
    npm install -g

Contributing
------------

  If you wish to contribute, review the [fork+pull model][fork_pull_model] documentation and the [language and grammar guideline][wiki].
  The basic workflow is as follows:

  1. [Fork][forking] bugswarm-developers
  2. Create a topic branch - `git checkout -b my_branch`
  3. Test your changes - `npm test`
  4. Push your changes - `git push origin my_branch`
  5. Initiate a [pull request][initiating_pull_requests]

Merging
-------

  For those with commit access, review [Managing Pull Requests][managing_pull_requests] to understand how to merge a pull request.
  If everything looks good after merging:
  
    npm test
    npm run-script doc && git push; git checkout master

[wiki]: https://github.com/buglabs/bugswarm-developers/wiki
[forking]: http://help.github.com/forking/
[issues]: http://github.com/buglabs/bugswarm-developers/issues
[initiating_pull_requests]: http://help.github.com/send-pull-requests#initiating_the_pull_request
[managing_pull_requests]: http://help.github.com/send-pull-requests#managing_pull_requests
[fork_pull_model]: http://help.github.com/send-pull-requests/
