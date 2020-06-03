FROM surferseo/emsdk

RUN apt-get update && apt-get install -y git

WORKDIR /
RUN git clone https://github.com/unicode-org/icu
RUN cd /icu && git checkout bb7b8481bdce7eb8ac40b3dbfd0a567b3c754cd6
RUN mv /icu/icu4c /icu/icu

COPY ./build /build
WORKDIR /build

# for `source /emsdk/emsdk_env.sh` to work
SHELL ["/bin/bash", "-c"]

RUN cp /build/icu.py /emsdk/emscripten/master/tools/ports
RUN mkdir -p /artifacts
RUN source /emsdk/emsdk_env.sh; EMCC_LOCAL_PORTS="icu=/icu" emcc break_iterator.c -s USE_ICU=1 -o /artifacts/break_iterator.wasm  -s EXPORTED_FUNCTIONS='["_main", "_break_iterator"]' -s ERROR_ON_UNDEFINED_SYMBOLS=0
