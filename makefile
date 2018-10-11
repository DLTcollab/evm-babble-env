nodes = 4

up: conf start

conf: 
	rm -rf conf
	./scripts/build-eth-conf.sh $(nodes)
	./scripts/build-babble-conf.sh $(nodes)
	./scripts/build-web-conf.sh $(nodes)

start:
	./scripts/run-testnet.sh $(nodes)

watch: 
	./scripts/watch.sh $(nodes)

stop: 
	./scripts/stop-testnet.sh
	rm -rf conf

.PHONY: up conf start watch stop
	
