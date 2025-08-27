const hre = require("hardhat");

async function main() {
    const [ deployer ] = await ethers.getSigners();

    console.log("Deploying contracts with the account: ", deployer.address);
    
    try {
        const Stable = await ethers.getContractFactory("RealDigital");
        const stable = await Stable.deploy(deployer.address);
        
        const stableAddress = await stable.waitForDeployment();
    
        const ImovelToken = await ethers.getContractFactory("ImovelToken");
        const imovelToken = await ImovelToken.deploy(stableAddress);

        const imovelAddress = await imovelToken.waitForDeployment();

        console.log("Stable address: ", stableAddress);
        console.log("ImovelToken address: ", imovelAddress);
    
    } catch(err) {
        console.error("Not deployed !",err);
        return 1;
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error, 1);
        process.exit(1);
    });
