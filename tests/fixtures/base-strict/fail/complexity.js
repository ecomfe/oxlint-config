// rule: complexity ["warn", 10]
// expect: eslint(complexity)
// This function has cyclomatic complexity > 10
function processData(a, b, c, d, e, f) {
    if (a) {
        if (b) {
            if (c) {
                if (d) {
                    if (e) {
                        if (f) {
                            if (a && b) {
                                if (b && c) {
                                    if (c && d) {
                                        if (d && e) {
                                            return 1;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return 0;
}
console.log(processData(true, true, true, true, true, true));
