const linkTerminationHard = /[[\p{WSpace}\p{NChar}\p{C}]--\p{Cf}]/v
const linkTerminationSoft = /[\x22\x27‘-‛‹›“-‟«»\p{Term}]/v
const bidiPairedBracketTypeOpen = /[\(\uFF08\uFE59\u207D\u208D\[\uFF3B\{\uFF5B\uFE5B\u0F3A\u0F3C\u169B\u2045\u2308\u230A\u29FC\u2983\u2985\uFF5F\u2987\u2989\u298B\u298D\u298F\u2991\u2993\u2995\u2997\u27C5\u27E6\u27E8\u27EA\u27EC\u27EE\u2768\u276A\u276C\u276E\u2770\u2772\u2774\u2E22\u2E24\u2E26\u2E28\u2E55\u2E57\u2E59\u2E5B\u2329\u3008\u300A\u300C\uFF62\u300E\u3010\u3014\uFE5D\u3016\u3018\u301A\u29D8\u29DA]/v
const bidiPairedBracketTypeClose = /[\)\uFF09\uFE5A\u207E\u208E\]\uFF3D\}\uFF5D\uFE5C\u0F3B\u0F3D\u169C\u2046\u2309\u230B\u29FD\u2984\u2986\uFF60\u2988\u298A\u298C\u298E\u2990\u2992\u2994\u2996\u2998\u27C6\u27E7\u27E9\u27EB\u27ED\u27EF\u2769\u276B\u276D\u276F\u2771\u2773\u2775\u2E23\u2E25\u2E27\u2E29\u2E56\u2E58\u2E5A\u2E5C\u232A\u3009\u300B\u300D\uFF63\u300F\u3011\u3015\uFE5E\u3017\u3019\u301B\u29D9\u29DB]/v
const linkPairedOpenersMap = new Map([[")", "("], ["]", "["], ["}", "{"], ["༻", "༺"], ["༽", "༼"], ["᚜", "᚛"], ["⁆", "⁅"], ["⁾", "⁽"], ["₎", "₍"], ["⌉", "⌈"], ["⌋", "⌊"], ["〉", "〈"], ["❩", "❨"], ["❫", "❪"], ["❭", "❬"], ["❯", "❮"], ["❱", "❰"], ["❳", "❲"], ["❵", "❴"], ["⟆", "⟅"], ["⟧", "⟦"], ["⟩", "⟨"], ["⟫", "⟪"], ["⟭", "⟬"], ["⟯", "⟮"], ["⦄", "⦃"], ["⦆", "⦅"], ["⦈", "⦇"], ["⦊", "⦉"], ["⦌", "⦋"], ["⦒", "⦑"], ["⦔", "⦓"], ["⦖", "⦕"], ["⦘", "⦗"], ["⧽", "⧼"], ["⦎", "⦏"], ["⦐", "⦍"], ["⧙", "⧘"], ["⧛", "⧚"], ["⸣", "⸢"], ["⸥", "⸤"], ["⸧", "⸦"], ["⸩", "⸨"], ["⹖", "⹕"], ["⹘", "⹗"], ["⹚", "⹙"], ["⹜", "⹛"], ["〉", "〈"], ["》", "《"], ["」", "「"], ["』", "『"], ["】", "【"], ["〕", "〔"], ["〗", "〖"], ["〙", "〘"], ["〛", "〚"], ["﹚", "﹙"], ["﹜", "﹛"], ["﹞", "﹝"], ["）", "（"], ["］", "［"], ["｝", "｛"], ["｠", "｟"], ["｣", "｢"]])

export function linkPairedOpeners(cp) {
    return linkPairedOpenersMap.get(cp);
}

/**
 * 
 * @param {string} cp 
 * @returns {"none" | "hard" | "soft" | "closing" | "opening"}
 */
export function linkTermination(cp) {
    if (linkTerminationHard.test(cp)) {
        return "hard";
    }
    if (linkTerminationSoft.test(cp)) {
        return "soft";
    }
    if (bidiPairedBracketTypeClose.test(cp)) {
        return "closing";
    }
    if (bidiPairedBracketTypeOpen.test(cp)) {
        return "opening";
    }
    return "none";
}

/**
 * @param {string} s 
 */
export function getLastSafe(s) {
    const cp = Array.from(s);
    const n = cp.length;
    let lastSafe = 0;
    let closingStack = [];
    for (let i = 0; i < n; i++) {
        let lt = linkTermination(cp[i]);
        if (lt === "none") {
            lastSafe = i + 1;
            continue;
        }
        if (lt === "soft") {
            continue;
        }
        if (lt === "hard") {
            break;
        }
        if (lt === "opening") {
            closingStack.push(cp[i]);
            continue;
        }
        if (lt === "closing") {
            const open = closingStack.pop();
            if (linkPairedOpeners(cp[i]) === open) {
                lastSafe = i + 1;
                continue;
            } else {
                break;
            }
        }
    }
    // returns code units length instead of code points length
    return cp.slice(0, lastSafe).join("").length
}
