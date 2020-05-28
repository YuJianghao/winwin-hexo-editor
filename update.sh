. ./scripts/printer.sh
. ./scripts/header.sh
. ./scripts/prerequest.sh

printTitle "⚙ Fetch updates from git"
git reset --hard
git submodule foreach 'git reset --hard'
git pull

. ./scripts/nodeModules.sh
. ./scripts/submodules.sh
