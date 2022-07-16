const web3 = require('web3');
const EthUtil = require('ethereumjs-util');

var nonce = 0;

const getSignatureFromPrivateKey = (signerPK, ...params) => {
    const messageHash = web3.utils.soliditySha3(...params, ++nonce);

    const messageHashX = EthUtil.hashPersonalMessage(EthUtil.toBuffer(messageHash));
    const privateKeyX = EthUtil.toBuffer(signerPK);

    const signedMessage = EthUtil.ecsign(messageHashX, privateKeyX);
    const signature = EthUtil.toRpcSig(signedMessage.v, signedMessage.r, signedMessage.s).toString("hex");

    return { signature, nonce };
}

module.exports = {
    getSignatureFromPrivateKey
}