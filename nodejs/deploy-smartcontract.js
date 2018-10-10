util = require('util');
path = require("path");
JSONbig = require('json-bigint');
argv = require('minimist')(process.argv.slice(2));
prompt = require('prompt');
EVMBabbleClient = require('./evm-babble-client.js');
Contract = require('./contract-lite.js');
Accounts = require('web3-eth-accounts');
var accounts = new Accounts('');
var fs = require('fs');

//------------------------------------------------------------------------------
//Console colors

FgRed = "\x1b[31m"
FgGreen = "\x1b[32m"
FgYellow = "\x1b[33m"
FgBlue = "\x1b[34m"
FgMagenta = "\x1b[35m"
FgCyan = "\x1b[36m"
FgWhite = "\x1b[37m"


log = function(color, text){
    console.log(color+text+'\x1b[0m');
}

step = function(message) {
    log(FgWhite, '\n' +  message)
    return new Promise((resolve) => {
        prompt.get('PRESS ENTER TO CONTINUE', function(err, res){
            resolve();
        });
    })  
}

explain = function(message) {
    log(FgCyan, util.format('\nEXPLANATION:\n%s', message))
}

space = function(){
    console.log('\n');
}

//------------------------------------------------------------------------------

sleep = function(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

//..............................................................................

function DemoNode(name, host, port) {
    this.name = name
    this.api = new EVMBabbleClient(host, port)
    this.accounts = {}
}

//------------------------------------------------------------------------------

var _demoNodes = [];
var _contractFile = 'Token.sol';
var _cfContract;
var _keystore = 'keystore';
var _pwdFile = 'pwd.txt';

init = function() {
    console.log(argv);
    var ips = argv.ips.split(",");
    var port = argv.port;
    _contractFile = argv.contract;
    _keystore = argv.keystore;
    _pwdFile = argv.pwd;

    var keystoreArray = readKeyStore(_keystore);
    var pwd = readPassFile(_pwdFile);
    _wallet = accounts.wallet.decrypt(keystoreArray, pwd);

    return new Promise((resolve, reject) => {
        for (i=0; i<ips.length; i++) {
            demoNode = new DemoNode(
                util.format('node%d', i+1),
                ips[i], 
                port);   
            _demoNodes.push(demoNode);
        }
        resolve()
    });
}

readKeyStore = function(dir) {

    var keystore = []
    
    files = fs.readdirSync(dir)
    
    for (i = 0, len = files.length; i < len; ++i) {
     
        filepath = path.join(dir, files[i]);
        if (fs.lstatSync(filepath).isDirectory()) {
            filepath = path.join(filepath, files[i]);
        }
        
        keystore.push(JSON.parse(fs.readFileSync(filepath)));

    }

    return keystore;

}

readPassFile = function(path) {
    return fs.readFileSync(path, 'utf8');
}

getControlledAccounts = function() {
    log(FgMagenta, 'Getting Accounts')
    return Promise.all(_demoNodes.map(function (node) {
        return  node.api.getAccounts().then((accs) => {
            log(FgGreen, util.format('%s accounts: %s', node.name, accs));
            node.accounts = JSONbig.parse(accs).accounts;
        });
    }));
}

deployContract = function(from, contractFile, contractName, args) {
    contract = new Contract(contractFile, contractName)
    contract.compile()

    var constructorParams = contract.encodeConstructorParams(args)

    tx = {
        from: from.accounts[0].address,
        gas: 1000000,
        gasPrice: 0,
        data: contract.bytecode + constructorParams
    }

    stx = JSONbig.stringify(tx)
    log(FgMagenta, 'Sending Contract-Creation Tx: ' + stx)
    
    return from.api.sendTx(stx).then( (res) => {
        log(FgGreen, 'Response: ' + res)
        txHash = JSONbig.parse(res).txHash.replace("\"", "")
        return txHash
    })
    .then( (txHash) => {
        return sleep(2000).then(() => {
            log(FgBlue, 'Requesting Receipt')
            return from.api.getReceipt(txHash)
        })
    }) 
    .then( (receipt) => {
        log(FgGreen, 'Tx Receipt: ' + receipt)
        address = JSONbig.parse(receipt).contractAddress
        contract.address = address
        return contract
    })

}
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// DEMO

prompt.start()
prompt.message = ''
prompt.delimiter =''

init()

.then(() => { space(); return getControlledAccounts()})

.then(() => { space(); return deployContract(_demoNodes[0], _contractFile, 'Token', [1000])})
.then((contract) => { return new Promise((resolve) => { _cfContract = contract; resolve();})})

.catch((err) => log(FgRed, err))

