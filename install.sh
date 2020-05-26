if ! [ -x "$(command -v git)" ]; then
  echo -e '\033[41;1mError:\033[0m git is not installed. Installer need it.'
  exit 1
fi
npmLock="package-lock.json"
yarnLock="yarn.lock"
if [  -f "$npmLock" ]; then
  rm $npmLock
fi
if ! [ -x "$(command -v yarn)" ]; then
  echo 'yarn is not installed. Try npm'
  if ! [ -x "$(command -v npm)" ]; then
    echo -e '\033[41;1mError:\033[0m npm is not installed.'
    echo 'To continue, you need to install yarn or npm.'
    exit 1
  else
  if [  -f "$yarnLock" ]; then
    rm $yarnLock
  fi
  # npm i
  fi
else
  yarn
fi
git submodule sync
git submodule update --init --recursive
if ! [ -x "$(command -v node)" ]; then
  echo -e '\033[41;1mError:\033[0m node is not installed.'
  echo 'To continue, you need to install node.'
  exit 1
else
  node install.js
fi