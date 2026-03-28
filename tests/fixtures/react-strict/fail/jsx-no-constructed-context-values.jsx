// rule: react/jsx-no-constructed-context-values is "warn" in strict config
// expect: eslint-plugin-react(jsx-no-constructed-context-values)
// Constructed context values cause unnecessary re-renders - warned in strict mode
import React from 'react';

const MyContext = React.createContext(null);

function Provider({ children }) {
    return (
        <MyContext.Provider value={{ data: 1, name: 'test' }}>
            {children}
        </MyContext.Provider>
    );
}

export default Provider;
