// rule: react/jsx-no-duplicate-props
// expect: eslint-plugin-react(jsx-no-duplicate-props)
// Exact duplicate props are not allowed
import React from 'react';

function Component() {
    return <div className="first" className="second" />;
}

export default Component;
