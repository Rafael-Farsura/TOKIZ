// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ImovelToken is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    mapping(uint256 => uint256) public precos;
    mapping(uint256 => address) public locatarios;

    IERC20 public moeda;

    event ImovelComprado(
        uint256 indexed tokenId,
        address indexed comprador,
        uint256 preco
    );

    event ImovelAlugado(
        uint256 indexed tokenId,
        address indexed locatario,
        uint256 precoAluguel
    );

    constructor(
        address _moeda
    ) ERC721("ImovelToken", "IMT") Ownable(msg.sender) {
        moeda = IERC20(_moeda);
    }

    function listarImovel(
        string memory tokenURI,
        uint256 preco
    ) public onlyOwner returns (uint256) {
        _tokenIdCounter += 1;

        _mint(msg.sender, _tokenIdCounter);
        _setTokenURI(_tokenIdCounter, tokenURI);

        precos[_tokenIdCounter] = preco;

        return _tokenIdCounter;
    }

    function comprarImovel(uint256 tokenId) public {
        require(
            msg.sender != ownerOf(tokenId),
            "O comprador ja e o proprietario"
        );
        uint256 preco = precos[tokenId];

        require(
            moeda.transferFrom(msg.sender, ownerOf(tokenId), preco),
            "Transferencia de token falhou"
        );

        _transfer(ownerOf(tokenId), msg.sender, tokenId);
        emit ImovelComprado(tokenId, msg.sender, preco);
    }

    function alugarImovel(uint256 tokenId, uint256 duracaoDias) public payable {
        require(
            msg.sender != ownerOf(tokenId),
            "O locatario ja eh o proprietario"
        );

        uint256 precoAluguel = (precos[tokenId] * duracaoDias) / 365;

        require(
            moeda.transferFrom(msg.sender, ownerOf(tokenId), precoAluguel),
            "Transferencia de token falhou"
        );

        locatarios[tokenId] = msg.sender;

        emit ImovelAlugado(tokenId, msg.sender, precoAluguel);
    }

    function finalizarAluguel(uint256 tokenId) public {
        require(
            msg.sender == locatarios[tokenId],
            "Somente o locatario pode finalizar o aluguel"
        );

        locatarios[tokenId] = address(0);
    }
}
