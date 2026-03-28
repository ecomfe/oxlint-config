// rule: react/jsx-no-constructed-context-values is "off" in base config
// expect: NO react/jsx-no-constructed-context-values violation
// Constructed context values should be fine in base (rule is off)
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
