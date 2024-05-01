import {
    assertEquals,
} from "https://deno.land/std@0.65.0/testing/asserts.ts";

import { getLastSafe } from "./draft-url-linkification.js";

Deno.test("getLastSafe, period-space", () => {
    assertEquals(getLastSafe("/wiki/アルベルト・アインシュタイン. Wikipedia."), "/wiki/アルベルト・アインシュタイン".length)
});

Deno.test("getLastSafe, question-space", () => {
    assertEquals(getLastSafe("/wiki/アルベルト・アインシュタイン? Wikipedia."), "/wiki/アルベルト・アインシュタイン".length)
});

Deno.test("getLastSafe, question-end", () => {
    assertEquals(getLastSafe("/wiki/アルベルト・アインシュタイン?"), "/wiki/アルベルト・アインシュタイン".length)
});

Deno.test("getLastSafe, space", () => {
    assertEquals(getLastSafe("/wiki/アルベルト・アインシュタイン contains"), "/wiki/アルベルト・アインシュタイン".length)
});

Deno.test("getLastSafe, unpaired close", () => {
    assertEquals(getLastSafe("/wiki/アルベルト・アインシュタイン)は重要"), "/wiki/アルベルト・アインシュタイン".length)
});

Deno.test("getLastSafe, paired open-close", () => {
    assertEquals(getLastSafe("/wiki/位相角_(天文学))は重要"), "/wiki/位相角_(天文学)".length)
});

Deno.test("getLastSafe, query", () => {
    assertEquals(getLastSafe("/w/index.php?title=式_(プログラミング)&action=edit"), "/w/index.php?title=式_(プログラミング)&action=edit".length)
});

Deno.test("getLastSafe, fragment", () => {
    assertEquals(getLastSafe("/wiki/式_(プログラミング)#式と文"), "/wiki/式_(プログラミング)#式と文".length)
});

Deno.test("getLastSafe, percent encoded", () => {
    assertEquals(getLastSafe("/wiki/%E5%85%83_(%E6%95%B0%E5%AD%A6) は大事"), "/wiki/%E5%85%83_(%E6%95%B0%E5%AD%A6)".length)
});

Deno.test("getLastSafe, greater than", () => {
    assertEquals(getLastSafe("/wiki/%E5%85%83_(%E6%95%B0%E5%AD%A6)>"), "/wiki/%E5%85%83_(%E6%95%B0%E5%AD%A6)".length)
});

Deno.test("getLastSafe, double quote", () => {
    assertEquals(getLastSafe("/wiki/%E5%85%83_(%E6%95%B0%E5%AD%A6)\""), "/wiki/%E5%85%83_(%E6%95%B0%E5%AD%A6)".length)
});

Deno.test("getLastSafe, emoji", () => {
    assertEquals(getLastSafe("/emoji?char=🐈"), "/emoji?char=🐈".length)
})

Deno.test("getLastSafe, emoji-period", () => {
    assertEquals(getLastSafe("/emoji?char=🐈."), "/emoji?char=🐈".length)
})

Deno.test("getLastSafe, emoji-period-emoji", () => {
    assertEquals(getLastSafe("/🐈.🐕"), "/🐈.🐕".length)
})
