###############################################
#
# Makefile
#
###############################################

.DEFAULT_GOAL := install

FILE = XMLHttpRequestCodeGenerator
DOMAIN = com.marclavergne

EXTDIR = $(HOME)/Library/Containers/com.luckymarmot.Paw/Data/Library/Application Support/com.luckymarmot.Paw/Extensions/${DOMAIN}.PawExtensions.${FILE}

deps:
	npm install typescript tsc tslint 

lint:
	node_modules/tslint/bin/tslint --project tslint.json **.ts

build: clean lint
	tsc -t ES6 --alwaysStrict --removeComments --diagnostics **.ts

install: build
	@mkdir -p "${EXTDIR}"
	@cp ${FILE}.js "${EXTDIR}"
	@echo "Installed ${FILE}.js"

clean:
	-rm *.js