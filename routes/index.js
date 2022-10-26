let express = require('express');
let router = express.Router();

const Web3 = require("web3");
const network = "https://goerli.infura.io/v3/f09c109bf87a41a685b747a90f30b68a";
const web3 = new Web3(new Web3.providers.HttpProvider(network));



const publicAddress = "0xeC07f167C47Ab840E3F066e55e363823d1Fe48d5";
const privateKey = "2aa6e1eec2b86b24974d59bd4edfae4d6e4ded09bcc8e6aae693c6dd086b93d9";

router.get('/', async function(req, res) {
    res.render('index', {
        balance: await getBalance(publicAddress),
        error: req.flash('error'),
        success: req.flash('success'),
        address: publicAddress
    });
});

router.post('/', async function (req, res) {
    let ethAmount = req.body.amount;
    let address = req.body.address;

    if (ethAmount === undefined || ethAmount === "") {
        req.flash('error', "The amount to sent must be given.");
        res.redirect("/");
        return;
    }

    if (isNaN(ethAmount)) {
        req.flash('error', "The amount must be numeric.");
        res.redirect("/");
        return;
    }

    if (address === undefined || address === "") {
        req.flash('error', "The recipient address must be given.");
        res.redirect("/");
        return;
    }

    // TODO: Test if the given ETH address is valid for the given network ...

    if (!web3.utils.isAddress(address)) {
        req.flash('error', "Invalid address")
        res.redirect("/")
        return
    }


    try {
        let txId = await sendEthereum(address, ethAmount);
        req.flash('success', ethAmount + " ETH sent successfully to" + address)
        console.log(txId)

    } catch(e) {
        req.flash('error', e.message)
        res.redirect("/")
    }

    req.flash('success', ethAmount + " ETH sent successfully to " + address
        + ". I may take up to few minutes before the transaction is completed.");
    res.redirect("/");
});

function getBalance(address) {
    // TODO: Retrieve the real ETH balance for a given address
    return new Promise((resolve, reject) => {
       web3.eth.getBalance(address, (err, result) => {
           if (err) {
               return reject(err)
           }
           const eth = web3.utils.fromWei(result, "ether")
           resolve(parseFloat(eth).toFixed(5))
       })
    });
}

async function sendEthereum(toAddress, ethAmount) {
    // TODO: Proceed to do the real transfer ...

    const txInfo = {
        from: publicAddress,
        to: toAddress,
        value: web3.utils.toWei(ethAmount.toString(), "ether"),
        gas: '21000'
    }

    const tx = await web3.eth.accounts.signTransaction(txInfo, privateKey)
    const result = await web3.eth.sendSignedTransaction(tx.rawTransaction)

    return result.transactionHash

}

module.exports = router;
