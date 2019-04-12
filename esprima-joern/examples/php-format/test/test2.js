tmp = 0;
realcommand = tmp + 10;
realcommand += 1;
test(realcommand);
realcommand = foo(tmp, realcommand);
var info = exec(realcommand);
