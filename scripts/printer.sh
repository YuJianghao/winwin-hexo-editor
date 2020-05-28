printNormal(){
  echo -e "${1}\c"
}
printSpace(){
  echo -e " \c"
}
printEndLine(){
  echo ""
}
printRed(){
  echo -e "\033[31m${1}\033[0m\c"
}
printGreen(){
  echo -e "\033[32m${1}\033[0m\c"
}
printBlue(){
  echo -e "\033[34m${1}\033[0m\c"
}
printBgRed(){
  echo -e "\033[41;1m${1}\033[0m\c"
}
printBgGreen(){
  echo -e "\033[42;1m${1}\033[0m\c"
}
printBgBlue(){
  echo -e "\033[44;1m${1}\033[0m\c"
}
printTitle(){
  printEndLine
  printNormal "\033[1m$1\033[0m"
  printEndLine
  printEndLine
}