import React, { useContext, useState } from "react";

const initialState = {
    seed: null,
    setSeed: () => { },
    clearSeed: () => { },
}

const SeedContext = React.createContext(initialState);

export const useSeed = () => {
    const [seed, setSeed, clearSeed] = useContext(SeedContext);
    return [
        seed,
        setSeed,
        clearSeed
    ]
};

const SeedContextProvider = ({ children }) => {
    const [seed, setSeed] = useState(new Array(12).fill());
    const clearSeed = () => {
        setSeed(new Array(12).fill());
    }
    const value = [
        seed,
        setSeed,
        clearSeed
    ]
    return (
        <SeedContext.Provider value={value}>
            {children}
        </SeedContext.Provider>
    )
}

export default SeedContextProvider;
