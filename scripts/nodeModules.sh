installNodeModules(){
  npmLock="package-lock.json"
  yarnLock="yarn.lock"
  freshInsall="installed"
  if [ -f "$npmLock" ]; then
    rm $npmLock
  fi
  if ! [ -x "$(command -v yarn)" ]; then
    echo 'yarn is not installed. Try npm'
    if [ -f "$yarnLock" ]; then
      rm $yarnLock
    fi
    npm i
  else
    yarn
  fi
}

printTitle "⚙ Install node packages"
installNodeModules
