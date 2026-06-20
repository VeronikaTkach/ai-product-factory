# A2UI Design

## When A2UI Helps

Use A2UI when:

- comparison or visualization matters
- the user needs controls
- the response is stateful
- interaction helps decision-making
- raw JSON would force the user to build UI manually

Do not use A2UI when:

- a short text answer is enough
- API-to-API consumers only need data
- the layout is fixed and already implemented normally

## Safe Generative UI

The agent describes:

- components
- composition
- labels
- actions
- data bindings

The client owns:

- actual components
- rendering
- styling
- event handling
- security boundaries

The agent must not emit executable frontend code for rendering.
