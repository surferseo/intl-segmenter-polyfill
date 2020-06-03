FROM debian:buster

RUN apt-get update && apt-get install -y build-essential git python


WORKDIR /
RUN git clone https://github.com/unicode-org/icu
WORKDIR /icu/icu4c/source
RUN git checkout bb7b8481bdce7eb8ac40b3dbfd0a567b3c754cd6

RUN ./runConfigureICU Linux --with-data-packaging=archive
RUN make -j$(nproc)

COPY ./assets /assets
RUN ICU_DATA_FILTER_FILE=/assets/filters.json ./runConfigureICU Linux --with-data-packaging=archive
RUN cd data && make clean && make
RUN mkdir -p /artifacts
RUN cp data/out/icu* /artifacts

WORKDIR /artifacts
RUN apt-get update && apt-get install -y xxd
RUN xxd -i icudt67l.dat data.h

ENTRYPOINT ["/entrypoint.sh"]
