// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract SignatureVerifier {

    using ECDSA for bytes32;

    address public signer;
    mapping(bytes => bool) private _usedHash;

    constructor(address _signer) {
        signer = _signer;
    }

    function getSigner() external view returns (address) {
        return signer;
    }

    function setSigner(address _signer) external {
        signer = _signer;
    }

    /** 
      * @dev Verify Signature
      * @param param1 Test Param
      * @param param2 Test Param
      * @param param3 Test Param
      * @param _signature Signature
      */
    function verify(uint256 param1, address param2, string memory param3, bytes memory _signature, uint256 nonce) external {
        verifySignature(param1, param2, param3, _signature, nonce);

        _usedHash[_signature] = true;
    }
     
    function verifySignature(
        uint256 param1,
        address param2,
        string memory param3,
        bytes memory _signature,
        uint256 nonce
    ) internal view {
        require(_usedHash[_signature] == false, "SignatureVerifier: already used signature");
        require(
            keccak256(abi.encodePacked(param1, param2, param3, nonce)).toEthSignedMessageHash().recover(_signature) == signer,
            "SignatureVerifier: invalid signature"
        );
    }
}