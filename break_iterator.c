#include <stdio.h>
#include <stdlib.h>
#include <unicode/putil.h>
#include <unicode/ubrk.h>
#include <unicode/uclean.h>
#include <unicode/udata.h>
#include <unicode/ustring.h>

#include "data.h"
#include "unicode/utext.h"

typedef void array_push(int32_t start, int32_t end, int32_t type,
                        const void* callback_id);

extern array_push push;

void utf8_break_iterator(int8_t break_type, const char* locale,
                         const char* to_break, int32_t to_break_len,
                         const void* callback_id) {
  UErrorCode status = U_ZERO_ERROR;

  udata_setCommonData(icudt67l_dat, &status);

  UBreakIterator* iter;

  UChar string_to_break[to_break_len + 1];
  u_uastrcpy(string_to_break, to_break);
  iter = ubrk_open(break_type, locale, string_to_break,
                   u_strlen(string_to_break), &status);

  int32_t end;
  int32_t start = ubrk_first(iter);
  int32_t n = 0;
  for (end = ubrk_next(iter); end != UBRK_DONE;
       start = end, end = ubrk_next(iter)) {
    push(start, end, ubrk_getRuleStatus(iter), callback_id);
  }

  ubrk_close(iter);
}

// differs from utf8_break_iterator in that it operates on raw bytes
// in case unicode implementation is not compatible (ie. in Elixir)
void break_iterator(int8_t break_type, const char* locale, const char* to_break,
                    const void* callback_id) {
  UErrorCode status = U_ZERO_ERROR;
  UText* utext_to_break = NULL;

  udata_setCommonData(icudt67l_dat, &status);

  UBreakIterator* iter;

  utext_to_break = utext_openUTF8(utext_to_break, to_break, -1, &status);

  iter = ubrk_open(break_type, locale, NULL, -1, &status);
  ubrk_setUText(iter, utext_to_break, &status);

  int32_t end;
  int32_t start = ubrk_first(iter);
  int32_t n = 0;
  for (end = ubrk_next(iter); end != UBRK_DONE;
       start = end, end = ubrk_next(iter)) {
    push(start, end, ubrk_getRuleStatus(iter), callback_id);
  }

  utext_close(utext_to_break);
  ubrk_close(iter);
}

// for WASI _start function to be generated
int main() { return 0; }
