# Independent onboarding review

This short review is for someone who has not worked on PhoenixCSS. It tests whether the repository explains its value and gets a developer to a real page without private help. It is a review protocol, not a claim that the review has happened.

## Before you start

Use a fresh directory and the public repository. Record the commit shown by `git rev-parse HEAD` and the exact Node.js and browser versions.

```bash
git clone https://github.com/OthmaneBlial/phoenixcss.git
cd phoenixcss
git rev-parse HEAD
node --version
npm ci
npm run build
python3 -m http.server 8765
```

Open the README first. Do not read the source or ask the maintainer for an explanation before completing the first pass.

## 60-second path

1. In the README, state in your own words what PhoenixCSS is for and what it does not provide.
2. Choose either the core or full stylesheet from the README. Explain why you chose it.
3. Open `http://127.0.0.1:8765/examples/guide.html` and identify the control that compares the same page with and without the built CSS.
4. Open the form example, submit it empty, then enter a valid sample address. Confirm that the feedback is local and that nothing is sent.
5. Open the landing page and resize it below and above 600 px. Say what changes.
6. Copy the smallest stylesheet snippet from the documentation into a throwaway HTML file beside the copied CSS. Confirm that it renders without a checkout-relative path.

## Questions to answer

- What problem did you think the project solved before reading the examples?
- How long did it take to reach the first styled page?
- Which file would you install in a documentation page, article, form, or small landing page?
- Was it clear which behavior comes from CSS and which behavior comes from example JavaScript?
- Did any instruction, link, class name, or screenshot contradict the rendered page?
- What would stop you from trying the package in a real project?
- What is the one change that would make you share it with another developer?

## Accessibility spot check

Use keyboard only on the guide, form, and documentation site. Record whether Tab, Shift+Tab, Enter, Space, and Escape reach and leave each visible control. At the browser's exact 200% zoom, check that headings, form labels, error text, select, radio buttons, checkbox, dialog, and mobile navigation remain usable. If a screen reader is available, record the product and version and read the headings, links, table, form error, navigation, and dialog.

Do not convert an automated axe result or a browser accessibility tree into a screen-reader result. Record only what you actually observed.

## Return template

```text
Reviewer:
Date:
Repository commit:
OS and browser:
Node version:
Time to first styled page:
Core/full choice and reason:
First confusing step:
Broken or contradictory link/instruction:
Keyboard result:
Exact zoom result:
Screen reader and result (or not available):
Would you try it in a project? Why:
Most valuable change:
Reproduction details for each issue:
```

Share the completed response with the maintainer and open a reproducible issue for each defect. Do not include private data or credentials in screenshots or reports.
