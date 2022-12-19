import { createContext } from "react";

const UserContext = createContext({
    provider: null,
    account: null,
    contract: null,
    connectError: "",
    connectWallet: null,
    disconnectWallet: null
})

export default UserContext;