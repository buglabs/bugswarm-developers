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

  In order to contribute to the developer portal, fork the repository, make your changes, and run `npm test` 
  **with root priveledges** from the root of the repository to generate new html files in order to view and 
  test those changes locally. When you are satisfied with your changes, submit a pull request with ONLY the
  source jade files.

  **Note:** When contributing, please reference the [wiki](https://github.com/buglabs/bugswarm-developers/wiki) 
  and make an effort to use consistent language and grammar. Thank you!