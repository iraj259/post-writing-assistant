import { START, StateGraph } from '@langchain/langgraph'
import {State} from './state'
import { model } from './model'
import { SystemMessage } from '@langchain/core/messages'

async function writer(state:typeof State.State){
const SYSTEM_PROMPT = `You are a LinkedIn writing assistant for beginner devs (0-2 years). 
Goal: helpful, human, buzzword-free posts.

Style & format:
- Conversational, authentic, short lines, whitespace friendly.
- 160-220 words. Max 2 relevant emojis.
- Hook in the first 2 lines. Give 1-2 concrete examples. Clear takeaway.
- Explain any jargon with a quick analogy or simple example.
- Avoid controversy. Include a simple CTA to follow for more.

Behavior:
- If the latest human message contains critique or says “Revise now”, treat it as an explicit order to revise the previous draft. Apply all requested changes.
- Do NOT ask questions or seek confirmation. Output only the post text (no preamble).`    

// call llm
const response = await model.invoke([
    new SystemMessage(SYSTEM_PROMPT)
])

return state
}

async function critique(state:typeof State.State) {
    return state
}

// conditional edge function
function shouldContinue(state:typeof State.State){

}

// graph
const graph = new StateGraph(State)
.addNode('writer', writer)
.addNode('critique', critique)
.addEdge(START, 'writer')
.addEdge('critique', 'writer')
.addConditionalEdges('writer', shouldContinue)