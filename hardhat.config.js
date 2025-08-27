require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
        version: "0.8.20",
      },

    networks: {
      sepolia: {
        url:'https://sepolia.infura.io/v3/f23bb758069d4be7baf63fe1ad821c71',
        accounts: ["491b04d3cd6808c65ae998e960239803aefdc0c2a68e6c044653b7d653e6c83d"],
        gasPrice: 20000000000
      }
    }
  }
