# Priority Filter: Feature Specification

## Goal

Let managers narrow the request list to a single priority level so they can quickly focus on the equipment requests that need attention, without losing sight of any existing request.

## User Need

As a manager, I want to filter the request list by priority with one click so that I can see the urgent (High priority) requests right away. I also want to be sure no request has been deleted or hidden permanently.

## Functional Rules

1. A row of filter buttons appears above the request table: **All**, **High**, **Medium**, **Low**.
2. When the page loads, **All** is selected and every request is shown, exactly as before the feature existed.
3. Selecting **High**, **Medium**, or **Low** shows only the requests whose priority is exactly that value. All other requests are hidden from view, not removed.
4. Selecting **All** shows every request again, including those with a missing or unrecognized priority.
5. Requests with a missing or unrecognized priority appear **only** under **All**. They are displayed with the label "Unspecified".
6. The selected button is visibly highlighted and marked as pressed (`aria-pressed="true"`). Exactly one button is selected at a time.
7. A count line reads **"Showing X of Y requests"**, where X is the number of visible rows and Y is the total number of requests.
8. If the selected priority has no matching requests, the table shows the message **"No requests match this filter."** in place of rows, and the count line reads "Showing 0 of Y requests".
9. Adding a new request keeps the current filter. The new request is visible right away if its priority matches the filter, and it is always counted in Y.
10. The order of requests does not change. Filtering does not sort.

## Constraints

- Use the priority values already stored on each request (High, Medium, Low, or blank). Do not add new data fields.
- No login and no database. The feature runs entirely in the browser.
- Preserve every existing request. Filtering never deletes, edits, or reorders data, in memory or in localStorage.
- Keep the existing new-request form and table columns unchanged.
- Plain HTML, CSS, and JavaScript, matching the current app. No new libraries.

## Acceptance Criteria

Tested against the built-in sample data: 8 requests in total (3 High, 2 Medium, 2 Low, 1 with no priority).

- **AC1 Default view:** On page load, **All** is selected, all 8 requests are visible, and the count reads "Showing 8 of 8 requests".
- **AC2 High filter:** Clicking **High** shows exactly requests #1, #3 and #7, each labeled High, and the count reads "Showing 3 of 8 requests".
- **AC3 Medium and Low filters:** Clicking **Medium** shows exactly #4 and #6. Clicking **Low** shows exactly #2 and #5. Each count reads "Showing 2 of 8 requests".
- **AC4 Back to All:** After any filter, clicking **All** shows all 8 requests again in their original order, including #8 labeled "Unspecified".
- **AC5 Unspecified priority:** Request #8 (no priority) does not appear under High, Medium, or Low.
- **AC6 Selected state:** Only the clicked button has `aria-pressed="true"` and the highlighted style.
- **AC7 Empty result:** When the selected priority has no matching requests, the table shows "No requests match this filter." and the count reads "Showing 0 of N requests". The sample data has at least one request at every level, so this is tested with the automated test in `tests/priority-filter.test.js`, which filters a list that has no Low requests.
- **AC8 New request while filtered:** With **High** selected, adding a High request makes it appear immediately and the count becomes "Showing 4 of 9 requests". Adding a Low request instead leaves the visible rows unchanged and the count becomes "Showing 3 of 9 requests".
- **AC9 No data loss:** After using every filter, reloading the page shows the same requests as before, with **All** selected.

## Out of Scope

- Sorting by priority or any other column.
- Remembering the selected filter after a page reload.
- Selecting more than one priority at a time.
- Editing or deleting requests, or changing a request's priority.
- Login, user roles, or any server or database storage.

## Verification Results

Tested on 2026-11-14 in the browser (`python3 -m http.server`, localStorage cleared first) and with `node --test tests/` (7 of 7 passing).

| Criterion | Result | Evidence |
|---|---|---|
| AC1 Default view | Pass | All pressed, rows 1–8, "Showing 8 of 8 requests" |
| AC2 High filter | Pass | Rows #1, #3, #7 only, "Showing 3 of 8 requests" |
| AC3 Medium and Low filters | Pass | Medium: #4, #6. Low: #2, #5. Both "Showing 2 of 8 requests" |
| AC4 Back to All | Pass | Rows 1–8 in original order, #8 labeled "Unspecified" |
| AC5 Unspecified priority | Pass | #8 absent from High, Medium and Low (browser and automated test) |
| AC6 Selected state | Pass | Exactly one button has `aria-pressed="true"` after each click |
| AC7 Empty result | Pass | Automated test returns 0 rows and "Showing 0 of 6 requests"; browser renders "No requests match this filter." for an empty result |
| AC8 New request while filtered | Pass | High selected: adding a High request showed #9 and "Showing 4 of 9 requests". Adding a Low request next left rows unchanged ("Showing 4 of 10 requests", since the High request was already added) |
| AC9 No data loss | Pass | After reload, All pressed and "Showing 10 of 10 requests" (8 sample + 2 added) |

## Clarifying Questions and Decisions

These are the questions asked before writing the spec, and the business decisions made in answer.

1. **Which requests "need attention"?** High priority. Managers can also view Medium or Low, but High is the main use.
2. **What control should managers use?** One-click buttons (All / High / Medium / Low) rather than a dropdown, so the active filter is always visible.
3. **What should show when the page first loads?** All requests, so existing behavior is unchanged.
4. **How should missing or unrecognized priorities be handled?** Show them only under All, labeled "Unspecified", so no request is hidden from every view.
5. **What counts as complete?** All acceptance criteria above pass in the browser, the count line is correct, and no request is lost after reload.

## Revision Notes

- **Reviewer change:** The first draft's criterion "The High filter shows high-priority requests" was rewritten as AC2, which names the exact requests (#1, #3, #7) and the exact count text so it can be observed and tested.
