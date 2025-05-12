ELECTRON_PATH := node_modules/electron/dist/chrome-sandbox

permissions:
	sudo chown root $(ELECTRON_PATH)
	sudo chmod 4755 $(ELECTRON_PATH)

prepare:
	npm install
	$(MAKE) permissions

run:
	npm run

test:
	npm test

build_win:
	npm build_win

build_win_portable:
	npm build_win_portable

build_linux:
	npm build_linux
