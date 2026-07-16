#!/usr/bin/env python3
"""PreToolUse 게이트: fable ON일 때 직접 파일 수정 시 오케스트레이션 리마인더를 부착한다.

서브에이전트(runner)의 툴 호출에도 훅이 동일하게 걸리므로 차단(deny)하지 않고
allow + 리마인더만 반환한다. OFF 상태면 아무것도 하지 않는다.
"""
import json
import pathlib
import sys

FABLE_DIR = pathlib.Path(__file__).resolve().parents[1]
state_file = FABLE_DIR / ".fable-state"
state = state_file.read_text().strip() if state_file.exists() else "off"
if state != "on":
    sys.exit(0)

try:
    data = json.load(sys.stdin)
except Exception:
    sys.exit(0)

if data.get("tool_name") in ("Edit", "Write", "NotebookEdit"):
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "allow",
            "permissionDecisionReason": (
                "Fable ON: 여러 파일에 걸친 반복 수정이면 runner 에이전트로 위임을 고려할 것. "
                "소규모 수정은 그대로 진행."
            ),
        }
    }, ensure_ascii=False))

sys.exit(0)
