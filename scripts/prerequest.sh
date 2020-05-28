check(){
  printNormal "$1: "
  if ! [ -x "$(command -v $1)" ]; then
    printRed "fail"
    printEndLine
    return 1
  else
    printGreen "pass"
    printEndLine
    return 0
  fi
}

printTitle "⚙ Check prerequest"
requests=('git' 'npm' 'node')
result=()
for item in ${requests[*]}
do
  if ! check "$item"; then
    result+=("$item")
  fi
done

if [ "${#result[*]}" -ne "0" ]; then
  printEndLine
  printBgRed "Prerequest check fail"
  printEndLine
  printEndLine
  for item in ${result[*]}
  do
    printRed "$item"
    printSpace
    printNormal "is not installed"
    printEndLine
  done
  exit 1
fi