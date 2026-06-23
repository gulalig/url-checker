# Job State Machine Diagram

```mermaid
stateDiagram-v2
  [*] --> pending

  pending --> in_progress: first URL check starts
  pending --> cancelled: cancellation requested

  in_progress --> completed: all URL checks finished
  in_progress --> cancelled: cancellation requested
  in_progress --> failed: unexpected internal error

  completed --> [*]
  cancelled --> [*]
  failed --> [*]
```