const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ImovelToken", function() {
    let ImovelToken, imovelToken, moeda, owner, comprador, locatario, terceiro;

    beforeEach(async function () {
        [owner, comprador, locatario, terceiro] = await ethers.getSigners();

        const ERC20 = await ethers.getContractFactory("RealDigital");
        moeda = await ERC20.deploy(owner.address);

        await moeda.mint(owner.address, ethers.parseEther("200"));

        ImovelToken = await ethers.getContractFactory("ImovelToken");
        imovelToken = await ImovelToken.deploy(moeda.target);


        await moeda.transfer(comprador.address, ethers.parseEther("100"));
        await moeda.transfer(locatario.address, ethers.parseEther("100"));
    });


    it("Deveria listar um imovel", async function() {
        await imovelToken.connect(owner).listarImovel("123456", ethers.parseEther("10"));
   
        expect(await imovelToken.tokenURI(1)).to.equal("123456");
        expect(await imovelToken.precos(1)).to.equal(ethers.parseEther("10"));
    });


    it("Deveria comprar um imovel", async function() {
        await imovelToken.connect(owner).listarImovel("uri", ethers.parseEther("10"));

        await moeda.connect(comprador).approve(imovelToken.target, ethers.parseEther("10"));

        await imovelToken.connect(comprador).comprarImovel(1);
        
        expect(await imovelToken.ownerOf(1)).to.equal(comprador.address);
    });

    it("Deveria alugar um imovel", async function() {
        await imovelToken.connect(owner).listarImovel("uri", ethers.parseEther("10"));
        
        await moeda.connect(locatario).approve(imovelToken.target, ethers.parseEther("1"));

        await imovelToken.connect(locatario).alugarImovel(1, 10); // 10d 
        expect(await imovelToken.locatarios(1)).to.equal(locatario.address);
    });

    it("Deveria finalizar o aluguel de um imovel", async function () {
        await imovelToken.connect(owner).listarImovel("uri", ethers.parseEther("10"));
        
        await moeda.connect(locatario).approve(imovelToken.target, ethers.parseEther("1"));

        await imovelToken.connect(locatario).alugarImovel(1, 10);
        await imovelToken.connect(locatario).finalizarAluguel(1);


        expect(await imovelToken.locatarios(1)).to.equal(ethers.ZeroAddress);
    });

    it("Nao deveria comprar um imovel se nao tiver fundos suficientes", async function() {
        await imovelToken.connect(owner).listarImovel("uri", ethers.parseEther("10"));
        await moeda.connect(terceiro).approve(imovelToken.target, ethers.parseEther("10"));
        await expect(imovelToken.connect(terceiro).comprarImovel(1)).to.be.revertedWithCustomError(moeda, "ERC20InsufficientBalance");
    });

    it("Nao deveria alugar um imovel se nao tiver fundos suficientes", async function(){
        await imovelToken.connect(owner).listarImovel("uri", ethers.parseEther("10"));
        await moeda.connect(terceiro).approve(imovelToken.target, ethers.parseEther("10"));
        await expect(imovelToken.connect(terceiro).alugarImovel(1, 10)).to.be.revertedWithCustomError(moeda, "ERC20InsufficientBalance");
        
    });
});