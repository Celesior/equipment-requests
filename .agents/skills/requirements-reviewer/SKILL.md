---
name: requirements-reviewer
description: Review whether an implemented feature matches its written specification. Use when asked to review, audit, or check a feature against a spec file (for example docs/*-spec.md), or before accepting a change that claims to implement a spec. Read-only by default.
---

# Requirements Reviewer

Compare a feature specification with the code that implements it, and report where they agree and where they do not. The goal is to catch gaps before a change is accepted, not to rewrite the code.

## When to use

- The user asks to review a feature against a spec, for example "Review the priority-filter feature against docs/priority-filter-spec.md".
- A pull request or branch claims to implement a specification and needs checking before merge.

Do not use this Skill for general code review with no specification, or for writing new features.

## Rules

- **Do not change any files unless the user explicitly asks you to.** This includes code, specs, tests and this Skill. Report findings only.
- Every finding must cite evidence: the spec section or criterion ID (for example `AC7` or `Functional Rules #9`) **and** the code location as `path:line`.
- If something cannot be confirmed from the files, say "Not verified" and explain what evidence is missing. Do not guess.
- Mark claims you confirmed by running tests or the app as **Observed**, and claims based only on reading code as **Inferred**.

## Evidence to examine

1. The specification file the user names. Read every section: Goal, User Need, Functional Rules, Constraints, Acceptance Criteria, Out of Scope, and any Verification Results.
2. The implementation files the feature touches (HTML, CSS, JavaScript). Use `git diff` against the base branch when available to find them.
3. Tests related to the feature. Run them if a test command is obvious (for example `node --test tests/`) and the run does not change files.
4. Data the feature depends on (sample data, storage keys) when a rule or criterion refers to it.

## Process

1. List each functional rule, constraint and acceptance criterion from the spec.
2. For each one, find the code that implements it and any test that checks it.
3. Look for behavior in the code that the spec does not ask for, especially anything listed under Out of Scope.
4. Check for data or security concerns: data loss or modification, unsafe HTML insertion (for example `innerHTML` with user input), storage errors, and anything that breaks the spec's constraints.
5. Rank findings by impact: Blocker, then Major, then Minor.

## Report format

Reply with these sections, in this order:

### 1. Satisfied acceptance criteria
A table: Criterion | Status (Satisfied / Partially / Not met / Not verified) | Spec evidence | Code evidence | Observed or Inferred.

### 2. Gaps
Spec requirements that are missing, incomplete, or only partly implemented. Include severity and evidence for each.

### 3. Unsupported behavior
Behavior in the code that the spec does not call for, or that the spec puts Out of Scope.

### 4. Data or security concerns
Risks to stored data, user input handling, or the spec's constraints. Write "None found" if there are none, and say what you checked.

### 5. Tests still needed
Criteria or rules with no automated or manual test, and a one-line description of the missing test.

### 6. Most important finding
The single finding the team should act on first, with a recommendation to accept, modify, or reject the change and the reason.
