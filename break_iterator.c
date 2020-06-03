// #include <emscripten.h>
#include <stdio.h>
#include <stdlib.h>
#include <unicode/putil.h>
#include <unicode/ubrk.h>
#include <unicode/uclean.h>
#include <unicode/udata.h>
#include <unicode/ustring.h>

#include "data.h"

typedef void array_push(int32_t, int32_t, int32_t);

extern array_push push;

void break_iterator(const char* locale, const char* cStringToExamine,
                    int32_t len) {
  UErrorCode status = U_ZERO_ERROR;

  udata_setCommonData(icudt67l_dat, &status);

  UBreakIterator* break_iterator;
  UChar stringToExamine[len + 1];

  u_uastrcpy(stringToExamine, cStringToExamine);

  break_iterator = ubrk_open(UBRK_WORD, locale, stringToExamine,
                             u_strlen(stringToExamine), &status);

  int32_t end;
  int32_t start = ubrk_first(break_iterator);
  int32_t n = 0;
  for (end = ubrk_next(break_iterator); end != UBRK_DONE;
       start = end, end = ubrk_next(break_iterator)) {
    push(start, end, ubrk_getRuleStatus(break_iterator));
  }

  ubrk_close(break_iterator);
}

// for WASI _start function to be generated
int main() { return 0; }
