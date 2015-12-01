# Batch Git Cherry-Pick

Node application that generates a batch `git cherry-pick` command based on regex searches on the commit logs.

This is useful if your repository commit logs are using a ticketing-based format.

**DISCLAIMER:** There are certain scenarios where batch cherry-picking is a necessity. When running the batch cherry pick command, expect to see conflicts. When merge conflicts arise, you will need to resolve them.

## Requirements

* *nix OS only
* node and git installed
* ssh keys set up to your git repository


## Installation

Run the install..

```
./install.sh
```

This installation will add an alias on your `.bash_profile` which is by default `gitcp`.

Modify if you already have this alias set.

**NOTE:** If you need to do a clean **re-install**, you will have to remove the added aliases on your `.bash_profile`


## Run

The alias to run

```
gitcp
```

**Arguments**

* **--regex** *(required)* Regular expression to search on the commit logs
* **--repo** *(optional)* GIT repository directory (default: current directory you are executing)
* **--branch** *(optional)* Branch where to cherry pick commits (default: current branch)
* **--nlogs** *(optional)* # of previous commits to check (default: the last 5,000 commits)
* **--author** *(optional)* simple string index, left-to-right, ignorecase author field search (default: all commits)

**Note:** When cherry picking from another branch, remember to pass the `--branch` argument

## Examples

* Current directory is the repository

```
gitcp --regex="^BUG-452([0-9]+)" --branch=feature/BUGS
```

* Repository is in another directory

```
gitcp --repo=/www/workspace/git/static/static-repo/ --regex="^TICKET-45([0-9]+)" --branch=staging/TICKETS
```

* Search the last 100 commits

```
gitcp --regex="^TASK-52([0-9]+)" --nlogs=100
```

* Search for commits by Helcon

```
gitcp --regex="^BUG-12([0-9]+)" --author=helcon --branch=develop
```

* Search for commits by Helcon Mabesa

```
gitcp --regex="^BUG-2([0-9]+)" --author="helcon mabesa"
```

