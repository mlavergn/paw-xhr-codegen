###############################################
#
# Makefile
#
###############################################

.DEFAULT_GOAL := install

FILE = XMLHttpRequestCodeGenerator
DOMAIN = com.marclavergne

EXTDIR = $(HOME)/Library/Containers/com.luckymarmot.Paw/Data/Library/Application Support/com.luckymarmot.Paw/Extensions/${DOMAIN}.PawExtensions.${FILE}

VERSION = 1.0.0

ver:
	sed -i '' 's/\(PAW XHRCodeGenerator \)\([0-9]\{1,3\}.[0-9]\{1,3\}.[0-9]\{1,3\}\)/\1${VERSION}/' XMLHttpRequestCodeGenerator.ts

deps:
	npm install typescript tsc tslint 

lint:
	node_modules/tslint/bin/tslint --project tslint.json **.ts

build: clean lint
	node_modules/typescript/bin/tsc -t ES6 --alwaysStrict --removeComments --diagnostics **.ts

install: build
	@mkdir -p "${EXTDIR}"
	@cp ${FILE}.js "${EXTDIR}"
	@echo "Installed ${FILE}.js"

clean:
	-rm *.js

release:
	hub release create -m "${VERSION} - PAW XHRCodeGenerator" -a XMLHttpRequestCodeGenerator.js -t master "${VERSION}"
	open "https://github.com/mlavergn/paw-xhr-codegen/releases"
