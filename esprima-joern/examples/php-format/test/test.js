function test(input) {
  input += 1;
  return input;
}
function foo(input, input2) {
  input = input2 + 2 + input;
  input = test(input);
  return input;
}
