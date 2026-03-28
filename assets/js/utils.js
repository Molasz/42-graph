"use strict";

import { N } from "./config.js";

export function mk(tag, a = {}) {
    const e = document.createElementNS(N, tag);
    for (const [k, v] of Object.entries(a)) e.setAttribute(k, v);
    return e;
}

export function tx(t, a = {}) {
    const e = mk("text", a);
    e.textContent = t;
    return e;
}
