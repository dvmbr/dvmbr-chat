# Writing rules for TODO

DVMBR's TODO system is designed to be a structured way to manage tasks and track progress. The following rules outline how to use it effectively.

This system uses the VS Code extension `Todo+`.

## TODO Structure

Organize TODOs into 3 sections: Backlog, Today, Archive

**Backlog**: contains all pending TODOs that are not planned for today
**Today**: contains TODOs that are planned for the current day
**Archive**: contains completed TODOs for record-keeping

```
Backlog:
  - todo 4
  - todo 6
  - todo 8
  - todo 9

Today:
  - todo 3
    - task 1
    - task 2
    - task 3

  - todo 5
    - task 1
      - subtask 1
      - subtask 2
    - task 2

  - todo 7
    - task 1
    - task 2

Archive:
  - todo 1
    - task 1
      - subtask 1
      - subtask 2
    - task 2

  - todo 2
    - task 1
      - subtask 1
    - task 2
      - subtask 1
```

## Usage

- Move TODOs from Backlog to Today when planning the day
- Move completed TODOs to Archive
- Do not keep completed items in Today
- Each TODO can have multiple tasks, and each task can have multiple subtasks
  - A TODO represents a single feature or goal
  - A task is a concrete step toward completing the TODO
  - A subtask is a smaller actionable unit
