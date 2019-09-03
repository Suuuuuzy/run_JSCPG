// iteration
function fib_it(num) {
	var a = 1, b = 0, tmp;
	while (num >= 0) {
		tmp = a;
		a = a + b;
		b = tmp;
		num--;
	}
	return b;
}

// recursive
function fib_re(num) {
	if (num <= 1) return 1;
	return fib_re(num-1) + fib_re(num-2);
}

// memoization 
function fib_memo(num, memo) {
  memo = memo || {};

  if (memo[num]) return memo[num];
  if (num <= 1) return 1;

  return memo[num] = fibonacci(num - 1, memo) + fibonacci(num - 2, memo);
}

fib_it(10);
fib_re(10);
fib_memo(10);
