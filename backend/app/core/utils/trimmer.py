from langchain_core.messages import trim_messages

trimmer = trim_messages(
    max_tokens=4096,
    strategy="last",             # keep the most recent messages
    token_counter=len,
    include_system=True,         # always keep system prompt
    allow_partial=False,         # never cut a message in half
    start_on="human",            # always start history on a human message
)