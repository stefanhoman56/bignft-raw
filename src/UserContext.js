import { createContext } from "react";

const UserContext = createContext({
    account: null,
    // readContract: readContract,
    userContract: null,
    connectError: "",
    connectWallet: null,
    disconnectWallet: null
})

export default UserContext;