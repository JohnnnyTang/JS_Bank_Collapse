let api = {
    "segment": "{ segment-name }",
    "set": "{ set-name }",
    "current-timepoint": "{ YYYY-MM-DD }",
    "comparison-timepoint": "{ YYYY-MM-DD }",
    "hs": "{ number-thickness-of-underlying-sand-layer }",
    "hc": "{ number-thickness-of-overlying-clay-layer }",
    "protection-level": "systemic" || "normal" || "low" || "no",
    "control-level": "strict" || "normal" || "low" || "no",
    "section-geometry": "{ GeoJson }",
    "bench-id": "{ dem-file-name }",
    "ref-id": "{ dem-file-name }",
    "water-qs": "{ number-water-qs }",
    "tidal-level": "{ number-tidal-difference }" || "dc" || "zc" || "xc",
    "wRE": "NONE" || "{ number-weight-riverbed-evolution }",
    "wNM": "NONE" || "{ number-weight-numerical-model }",
    "wGE": "NONE" || "{ number-weight-geology-andengineering }",
    "risk-thresholds": "NONE" || {
        "Dsed": "NONE" || [
            "{ number-threshold-between-low-and-relativelyLow-risk }",
            "{ number-threshold-between-relativelyLow-and-relativelyHigh-risk }",
            "{ number-threshold-between-relativelyHigh-and-high-risk }"
        ],
        "Zb": "NONE" || [
            "{ number-threshold-between-low-and-relativelyLow-risk }",
            "{ number-threshold-between-relativelyLow-and-relativelyHigh-risk }",
            "{ number-threshold-between-relativelyHigh-and-high-risk }"
        ],
        "Sa": "NONE" || [
            "{ number-threshold-between-low-and-relativelyLow-risk }",
            "{ number-threshold-between-relativelyLow-and-relativelyHigh-risk }",
            "{ number-threshold-between-relativelyHigh-and-high-risk }"
        ],
        "Ln": "NONE" || [
            "{ number-threshold-between-low-and-relativelyLow-risk }",
            "{ number-threshold-between-relativelyLow-and-relativelyHigh-risk }",
            "{ number-threshold-between-relativelyHigh-and-high-risk }"
        ],
        "PQ": "NONE" || [
            "{ number-threshold-between-low-and-relativelyLow-risk }",
            "{ number-threshold-between-relativelyLow-and-relativelyHigh-risk }",
            "{ number-threshold-between-relativelyHigh-and-high-risk }"
        ],
        "Ky": "NONE" || [
            "{ number-threshold-between-low-and-relativelyLow-risk }",
            "{ number-threshold-between-relativelyLow-and-relativelyHigh-risk }",
            "{ number-threshold-between-relativelyHigh-and-high-risk }"
        ],
        "Zd": "NONE" || [
            "{ number-threshold-between-low-and-relativelyLow-risk }",
            "{ number-threshold-between-relativelyLow-and-relativelyHigh-risk }",
            "{ number-threshold-between-relativelyHigh-and-high-risk }"
        ],
        "all": "NONE" || [
            "{ number-threshold-between-low-and-relativelyLow-risk }",
            "{ number-threshold-between-relativelyLow-and-relativelyHigh-risk }",
            "{ number-threshold-between-relativelyHigh-and-high-risk }"
        ],
    }
}