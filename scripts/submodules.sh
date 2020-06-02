printTitle "⚙ Setup submodules"
git submodule sync
git submodule update --init --recursive
git submodule foreach 'git pull origin master'
if ! [ -f "$freshInsall" ]; then
  printNormal "Fresh install"
  git submodule foreach 'git pull origin master'
  touch $freshInsall
fi