FROM debian:buster

RUN apt-get update && apt-get install -y build-essential git python clang llvm cmake libxml2 wget python-pip python3 python3-pip zip unzip ca-certificates

RUN mkdir -p /emsdk

WORKDIR /
RUN git clone https://github.com/emscripten-core/emsdk.git
WORKDIR /emsdk

RUN git checkout 6b0d151917fe508007d9d76791369ec94c4eb304
RUN ./emsdk install sdk-upstream-master-64bit
RUN ./emsdk activate sdk-upstream-master-64bit


WORKDIR /
RUN git clone https://github.com/unicode-org/icu
RUN cd /icu && git checkout bb7b8481bdce7eb8ac40b3dbfd0a567b3c754cd6
RUN mv /icu/icu4c /icu/icu

COPY ./build /build
WORKDIR /build

# for source to work
SHELL ["/bin/bash", "-c"]

RUN cp /build/icu.py /emsdk/emscripten/master/tools/ports
RUN mkdir -p /artifacts
RUN source /emsdk/emsdk_env.sh; EMCC_LOCAL_PORTS="icu=/icu" emcc test.c -s USE_ICU=1 -o /artifacts/test.wasm  -s EXPORTED_FUNCTIONS='["_main", "_doit", "_test"]' -s ERROR_ON_UNDEFINED_SYMBOLS=0
