from app.core.state import GraphState
def should_proceed(state: GraphState) -> str:
    if state.get("proceed", False):
        return "proceed"
    return "no-proceed"