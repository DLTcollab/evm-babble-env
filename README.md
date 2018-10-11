# EVM Babble Environment
Deploy environment for running evm-babble

## Prerequisites
1. Install the Docker
2. Install the Node.js

## Manage Enviroment

### Launch Docker 
```bash
$ make
```

### Stop Docker
```bash
$ make stop
```
## Usage
Before using the script, make sure that you have started the environment.

### Deploy smart contract
```bash
$ node nodejs/deploy-smartcontract.js --ips=[babble node IPs] --port="8080" --contractName=[smart contract name] --contractPath=[smart contract path] --keystore="conf/keystore" --pwd="conf/pwd.txt"

# Example
$ node nodejs/deploy-smartcontract.js --ips="172.77.5.5,172.77.5.6,172.77.5.7,172.77.5.8" --port="8080" --contractName="CrowdFunding" --contractPath="nodejs/crowd-funding.sol" --keystore="conf/keystore" --pwd="conf/pwd.txt"
```

### Invoke exist smart contract
```bash
$ node nodejs/crowd-funding-test.js --ips=[babble node IPs] --port="8080" --contractName=[smart contract name] --contractPath=[smart contract path] --contractAddress=[smart contract address] --keystore="conf/keystore" --pwd="conf/pwd.txt"

# Example
$ node nodejs/crowd-funding-test.js --ips="172.77.5.5,172.77.5.6,172.77.5.7,172.77.5.8" --port="8080" --contractName="CrowdFunding" --contractPath="nodejs/crowd-funding.sol" --contractAddress="0x4803adc2b9b54cf014ff3783cbe20be78a13b604" --keystore="conf/keystore" --pwd="conf/pwd.txt"
```

