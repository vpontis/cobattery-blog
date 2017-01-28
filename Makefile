
#
# Includes.
#

ifndef NODE_ENV
	include .env
endif

#
# Variables.
#

bin = ./node_modules/.bin
node = node
run =

babel = $(bin)/babel
concurrently = $(bin)/concurrently
nodemon = $(bin)/nodemon

babel_flags = \
	--plugins transform-async-to-generator,transform-es2015-modules-commonjs \
	--out-dir build \
	--copy-files

nodemon_flags = \
	--ignore ./lib \
	--ignore ./public

#
# Flags.
#

# Run commands in debug mode. (default: false)
DEBUG ?= false

#
# Config.
#

ifeq ($(NODE_ENV),development)
	run = heroku local:run
	node = $(nodemon) $(nodemon_flags)
endif

ifeq ($(DEBUG),true)
	node = node debug
endif

#
# Targets.
#

# Compile the source files with Babel.
build:
	@ $(babel) $(babel_flags) ./lib

# Remove all of the generated files.
clean:
	@ rm -rf ./build ./node_modules

# Install the dependencies.
install:
	@ npm install

# Compile the favicon.ico file from favicon.png with Imagemagick.
favicon:
	@ convert \
  		./public/favicon-16.png ./public/favicon-32.png ./public/favicon-64.png \
  		./public/favicon.ico

# Run the development server.
start:
	@ $(run) $(node) ./build

# Watch the source files and the server.
watch:
	@ $(concurrently) --kill-others --prefix "[{name}]" --names "build,start" \
		"make build babel_flags='$(babel_flags) --watch'" \
		"sleep 1 && make start node='$(nodemon) $(nodemon_flags)'"

#
# Phonies.
#

.PHONY: build
