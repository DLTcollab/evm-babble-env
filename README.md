# evm-babble 

## Requirement
### Docker
```bash
$ curl -sSL https://get.docker.com/ubuntu/ | sudo sh
```
## Set up environment
### Create testnet
```bash
$ make
```
### Deploy smart contract
```bash
$ node nodejs/deploy-smartcontract.js --ips=[babble node IPs] --port=8080 --contract=[smart contract path] --keystore=conf/keystore --pwd=conf/pwd.txt

# Example
#node nodejs/deploy-smartcontract.js --ips=172.77.5.5,172.77.5.6,172.77.5.7,172.77.5.8 --port=8080 --contract=nodejs/Token.sol --keystore=conf/keystore --pwd=conf/pwd.txt 
```