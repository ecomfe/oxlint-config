// rule: no-unmodified-loop-condition
// expect: eslint(no-unmodified-loop-condition)
// Loop condition variable 'running' is never modified inside the loop
let running = true;
while (running) {
    console.log('this loops forever');
}
